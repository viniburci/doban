import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RecursoFormConfig, RecursoListItem } from '../recurso-form-config.interface';
import { DataService } from '../../../services/data-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-recurso-base',
  imports: [ReactiveFormsModule, NgxMaskDirective, CommonModule],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-base.html',
  styleUrl: './cadastro-recurso-base.css'
})
export class CadastroRecursoBase<TRequest, TResponse, TListItem extends RecursoListItem> {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  // Inputs/Outputs
  config = input.required<RecursoFormConfig<TRequest, TResponse, TListItem>>();
  pessoaId = input<string | null>(null);
  editRecurso = input<any | null>(null);

  updated = output<void>();
  closeForm = output<void>();

  // State
  editMode = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  listaRecursos = signal<TListItem[] | null>(null);

  form!: FormGroup<{
    id: FormControl<string | null>;
    resourceId: FormControl<string | null>;
    pessoaId: FormControl<string | null>;
    dataEntrega: FormControl<string | null>;
    dataDevolucao: FormControl<string | null>;
  }>;

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      resourceId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });

    this.config().listFn().subscribe(data => this.listaRecursos.set(data));
  }

  patchForm() {
    this.editMode.set(!!this.editRecurso());

    if (this.editRecurso() == null) {
      this.form.enable();
      this.form.reset();
      return;
    }

    const recurso = this.editRecurso();
    const cfg = this.config();

    const recursoFormatado = {
      id: recurso?.id ?? null,
      resourceId: recurso?.[cfg.fieldConfig.resourceIdField] ?? null,
      pessoaId: recurso?.pessoaId ?? null,
      dataEntrega: recurso?.dataEntrega
        ? this.dataService.convertISOToDateBR(recurso.dataEntrega)
        : null,
      dataDevolucao: recurso?.dataDevolucao
        ? this.dataService.convertISOToDateBR(recurso.dataDevolucao)
        : null,
    };

    this.form.patchValue(recursoFormatado);

    // Desabilita campos em modo de edição
    this.form.get('id')!.disable();
    this.form.get('resourceId')!.disable();
    this.form.get('pessoaId')!.disable();
    this.form.get('dataEntrega')!.disable();
  }

  onSubmit() {
    this.form.enable();
    const cfg = this.config();

    const formValue = this.form.value;
    const cleaned: any = {
      id: formValue.id,
      [cfg.fieldConfig.resourceIdField]: formValue.resourceId,
      pessoaId: this.pessoaId(),
      dataEntrega: this.dataService.convertDateToISO(formValue.dataEntrega!),
      dataDevolucao: this.dataService.convertDateToISO(formValue.dataDevolucao!)
    };

    const devolucao = {
      dataDevolucao: cleaned.dataDevolucao
    };

    const request$ = !this.editMode()
      ? cfg.createFn(cleaned)
      : cfg.updateFn(Number(cleaned.id), devolucao);

    request$.subscribe({
      next: () => {
        this.updated.emit();
        this.onCloseForm();
      },
      error: (error) => {
        this.errorMessage.set(
          `Erro ao salvar recurso de ${cfg.fieldConfig.resourceTypeLabel}: ` +
          (error.error?.message || error.message || 'Erro desconhecido.')
        );
      }
    });
  }

  onCloseForm() {
    this.editMode.set(false);
    this.form.reset();
    this.form.enable();
    this.closeForm.emit();
  }
}

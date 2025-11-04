import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CelularService } from '../../../services/celular-service';
import { RecursoCelularRequestDTO } from '../../../entities/recursoCelularRequestDTO.model';
import { RecursoCelularResponseDTO } from '../../../entities/recursoCelularResponseDTO.model';
import { CelularFormData } from '../../../entities/celularFormData.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DataService } from '../../../services/data-service';
import { RecursoService } from '../../../services/recurso-service';

@Component({
  selector: 'app-cadastro-recurso-celular',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-celular.html',
  styleUrl: './cadastro-recurso-celular.css'
})
export class CadastroRecursoCelular implements OnInit {

  private fb = inject(FormBuilder);
  private recursoService = inject(RecursoService);
  private celularService = inject(CelularService);
  private dataService = inject(DataService);

  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);
  editRecurso = input<RecursoCelularResponseDTO | null>(null);
  updated = output<void>();
  listaCelulares = signal<CelularFormData[] | null>(null);
  closeForm = output<void>();
  errorMessage = signal<string | null>(null);

  form!: FormGroup<{ [K in keyof RecursoCelularRequestDTO]: FormControl<RecursoCelularRequestDTO[K]> }>;

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      celularId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });
    this.celularService.listar().subscribe(data => this.listaCelulares.set(data));
  }

  onSubmit() {
    this.form.enable();
    const cleaned = ({
      ...this.form.value,
      pessoaId: this.pessoaId(),
      dataEntrega: this.dataService.convertDateToISO(this.form.value.dataEntrega!),
      dataDevolucao: this.dataService.convertDateToISO(this.form.value.dataDevolucao!)
    } as RecursoCelularRequestDTO);

    const devolucao = {
      dataDevolucao: cleaned.dataDevolucao
    }

    const request$ = !this.editMode()
      ? this.recursoService.createRecursoCelular(cleaned)
      : this.recursoService.registrarDevolucaoCelular(Number(cleaned.id), devolucao);

    request$.subscribe({
      next: (response: RecursoCelularResponseDTO) => {
        this.updated.emit();
        this.onCloseForm();
      },
      error: (error) => {
        this.errorMessage.set('Erro ao salvar recurso de celular: ' + (error.error?.message || error.message || 'Erro desconhecido.'));
      }
    });
  }

  patchForm() {
    this.editMode.set(!!this.editRecurso());
    if (this.editRecurso() == null) {
      this.form.reset();
      return;
    }
    if (this.editRecurso() != null) {
      const recursoFormatado: RecursoCelularResponseDTO = {
        ...this.editRecurso(),
        id: this.editRecurso()?.id ?? null,
        dataEntrega: this.editRecurso()?.dataEntrega ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataEntrega) : null,
        dataDevolucao: this.editRecurso()?.dataDevolucao ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataDevolucao) : null,
      } as RecursoCelularResponseDTO;
      this.form.patchValue(recursoFormatado || {});
    }
    this.form.get('id')!.disable();
    this.form.get('celularId')!.disable();
    this.form.get('pessoaId')!.disable();
    this.form.get('dataEntrega')!.disable();
  }

  onCloseForm() {
    this.editMode.set(false);
    this.form.reset();
    this.form.enable();
    this.closeForm.emit();
  }
}

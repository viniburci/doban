import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RecursoService } from '../../../services/recurso-service';
import { RocadeiraService } from '../../../services/rocadeira-service';
import { DataService } from '../../../services/data-service';
import { RecursoRocadeiraRequestDTO } from '../../../entities/recursoRocadeiraRequestDTO.model';
import { RecursoRocadeiraResponseDTO } from '../../../entities/recursoRocadeiraResponseDTO.model';
import { RocadeiraResponseDTO } from '../../../entities/rocadeiraResponseDTO.model';

@Component({
  selector: 'app-cadastro-recurso-rocadeira',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-rocadeira.html',
  styleUrl: './cadastro-recurso-rocadeira.css'
})
export class CadastroRecursoRocadeira {

  private fb = inject(FormBuilder);
  private recursoService = inject(RecursoService);
  private rocadeiraService = inject(RocadeiraService);
  private dataService = inject(DataService);
  
  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);
  editRecurso = input<RecursoRocadeiraRequestDTO | null>(null);
  updated = output<void>();
  listaRocadeiras = signal<RocadeiraResponseDTO[] | null>(null);
  closeForm = output<void>();
  errorMessage = signal<string | null>(null);

  form!: FormGroup<{ [K in keyof RecursoRocadeiraRequestDTO]: FormControl<RecursoRocadeiraRequestDTO[K]> }>;

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      rocadeiraId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });
    this.rocadeiraService.listarRocadeiras().subscribe(data => this.listaRocadeiras.set(data));
  }

  onSubmit() {
    this.form.enable();
    const cleaned = ({
      ...this.form.value,
      pessoaId: this.pessoaId(),
      dataEntrega: this.dataService.convertDateToISO(this.form.value.dataEntrega!),
      dataDevolucao: this.dataService.convertDateToISO(this.form.value.dataDevolucao!)
    } as RecursoRocadeiraRequestDTO);

    console.log('pessoaId: ', this.pessoaId());

    const devolucao = {
      dataDevolucao: cleaned.dataDevolucao
    }

    const request$ = !this.editMode()
      ? this.recursoService.createRecursoRocadeira(cleaned)
      : this.recursoService.registrarDevolucaoRocadeira(Number(cleaned.id), devolucao);

    request$.subscribe({
      next: (response: RecursoRocadeiraResponseDTO) => {
        this.updated.emit();
        this.onCloseForm();
      },
      error: (error) => {
        this.errorMessage.set('Erro ao salvar recurso de rocadeira: ' + (error.error?.message || error.message || 'Erro desconhecido.'));
      }
    });
  }

  patchForm() {
    this.editMode.set(!!this.editRecurso());
    if (this.editRecurso() == null) {
      this.form.enable();
      this.form.reset();
      return;
    }
    if (this.editRecurso() != null) {
      const recursoFormatado: RecursoRocadeiraRequestDTO = {
        ...this.editRecurso(),
        id: this.editRecurso()?.id ?? null,
        dataEntrega: this.editRecurso()?.dataEntrega ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataEntrega) : null,
        dataDevolucao: this.editRecurso()?.dataDevolucao ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataDevolucao) : null,
      } as RecursoRocadeiraRequestDTO;
      this.form.patchValue(recursoFormatado || {});
    }
    this.form.get('id')!.disable();
    this.form.get('rocadeiraId')!.disable();
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

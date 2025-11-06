import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RecursoCarroRequestDTO } from '../../../entities/recursoCarroRequestDTO.model';
import { RecursoService } from '../../../services/recurso-service';
import { DataService } from '../../../services/data-service';
import { CarroService } from '../../../services/carro-service';
import { CarroFormData } from '../../../entities/carroFormData.model';

@Component({
  selector: 'app-cadastro-recurso-carro',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-carro.html',
  styleUrl: './cadastro-recurso-carro.css'
})
export class CadastroRecursoCarro {
  private fb = inject(FormBuilder);
  private recursoService = inject(RecursoService);
  private carroService = inject(CarroService);
  private dataService = inject(DataService);
  
  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);
  editRecurso = input<RecursoCarroRequestDTO | null>(null);
  updated = output<void>();
  listaCarros = signal<CarroFormData[] | null>(null);
  closeForm = output<void>();
  errorMessage = signal<string | null>(null);

  form!: FormGroup<{ [K in keyof RecursoCarroRequestDTO]: FormControl<RecursoCarroRequestDTO[K]> }>;

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      carroId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });
    this.carroService.listar().subscribe(data => this.listaCarros.set(data));
  }

  onSubmit() {
    this.form.enable();
    const cleaned = ({
      ...this.form.value,
      pessoaId: this.pessoaId(),
      dataEntrega: this.dataService.convertDateToISO(this.form.value.dataEntrega!),
      dataDevolucao: this.dataService.convertDateToISO(this.form.value.dataDevolucao!)
    } as RecursoCarroRequestDTO);

    const devolucao = {
      dataDevolucao: cleaned.dataDevolucao
    }

    const request$ = !this.editMode()
      ? this.recursoService.createRecursoCarro(cleaned)
      : this.recursoService.registrarDevolucaoCarro(Number(cleaned.id), devolucao);

    request$.subscribe({
      next: (response: RecursoCarroRequestDTO) => {
        this.updated.emit();
        this.onCloseForm();
      },
      error: (error) => {
        this.errorMessage.set('Erro ao salvar recurso de carro: ' + (error.error?.message || error.message || 'Erro desconhecido.'));
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
      const recursoFormatado: RecursoCarroRequestDTO = {
        ...this.editRecurso(),
        id: this.editRecurso()?.id ?? null,
        dataEntrega: this.editRecurso()?.dataEntrega ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataEntrega) : null,
        dataDevolucao: this.editRecurso()?.dataDevolucao ? this.dataService.convertISOToDateBR(this.editRecurso()!.dataDevolucao) : null,
      } as RecursoCarroRequestDTO;
      this.form.patchValue(recursoFormatado || {});
    }
    this.form.get('id')!.disable();
    this.form.get('carroId')!.disable();
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

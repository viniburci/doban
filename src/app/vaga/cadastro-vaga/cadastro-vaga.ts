import { Component, input, OnInit, signal, inject, output, effect } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtestadoSaudeOcupacional, TipoAcrescimoSubstituicao, TipoContratante, TipoContrato, VagaFormData } from '../../entities/vagaFormData.model';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { VagaService } from '../../services/vaga-service';
import { DataService } from '../../services/data-service';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../entities/cliente.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cadastro-vaga',
  imports: [ReactiveFormsModule, TitleCasePipe, NgxMaskDirective, CommonModule],
  providers: [provideNgxMask()],
  standalone: true,
  templateUrl: './cadastro-vaga.html',
  styleUrl: './cadastro-vaga.css'
})
export class CadastroVaga implements OnInit {
  private fb = inject(FormBuilder);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private clienteService = inject(ClienteService);
  private destroy$ = new Subject<void>();

  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);
  editVaga = input<VagaFormData | null>(null);
  updated = output<boolean>();
  closeForm = output<void>();

  clientes = signal<ClienteDTO[]>([]);

  form!: FormGroup<{ [K in keyof VagaFormData]: FormControl<VagaFormData[K]> }>;

  TipoContrato = TipoContrato;
  TipoAcrescimoSubstituicao = TipoAcrescimoSubstituicao
  AtestadoSaudeOcupacional = AtestadoSaudeOcupacional;
  TipoContratante = TipoContratante;
  protected readonly Object = Object;

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.editMode.set(true);
    }

    this.carregarClientes();

    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      cliente: new FormControl<string | null>(null),
      clienteId: new FormControl<number | null>(null),
      clienteNome: new FormControl<string | null>(null),
      cidade: new FormControl<string | null>(null),
      uf: new FormControl<string | null>(null),
      cargo: new FormControl<string | null>(null),
      setor: new FormControl<string | null>(null),
      salario: new FormControl<number | null>(null),
      tipoContrato: new FormControl<TipoContrato | null>(null),
      dataAdmissao: new FormControl<string | null>(null),
      dataDemissao: new FormControl<string | null>(null),
      acrescimoOuSubstituicao: new FormControl<TipoAcrescimoSubstituicao | null>(null),
      aso: new FormControl<AtestadoSaudeOcupacional | null>(null),
      optanteVT: new FormControl<boolean | null>(null),
      horarioEntrada: new FormControl<string | null>(null),
      horarioSaida: new FormControl<string | null>(null),
      contratante: new FormControl<TipoContratante | null>(TipoContratante.DOBAN_PRESTADORA_DE_SERVIÇOS_LTDA)
    });
  }

  patchForm() {
    this.editMode.set(!!this.editVaga());
    if (this.editVaga() == null) {
      this.form.reset();
      return;
    }
    if (this.editVaga() != null) {
      const vagaFormatada: VagaFormData = {
        ...this.editVaga(),
        id: this.editVaga()?.id ?? null,
        dataAdmissao: this.editVaga()?.dataAdmissao ? this.dataService.convertISOToDateBR(this.editVaga()!.dataAdmissao) : null,
        dataDemissao: this.editVaga()?.dataDemissao ? this.dataService.convertISOToDateBR(this.editVaga()!.dataDemissao) : null,
        horarioEntrada: this.editVaga()?.horarioEntrada ? this.dataService.convertToLocalTime(this.editVaga()!.horarioEntrada) : null,
        horarioSaida: this.editVaga()?.horarioSaida ? this.dataService.convertToLocalTime(this.editVaga()?.horarioSaida!) : null,
      } as VagaFormData;
      this.form.patchValue(vagaFormatada || {});
    }
  }

  carregarClientes() {
    this.clienteService.listarAtivos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => this.clientes.set(clientes),
        error: (error) => console.error('Erro ao carregar clientes:', error)
      });
  }

  getEnumValues(enumObj: any): string[] {
    return Object.values(enumObj);
  }

  onCloseForm() {
    this.editMode.set(false);
    this.form.reset();
    this.closeForm.emit();
  }

  onSubmit() {
    const raw = this.form.getRawValue();

    let cleaned = {
      ...raw,
      dataDemissao: raw.dataDemissao ? this.dataService.convertDateToISO(raw.dataDemissao) : null,
      dataAdmissao: raw.dataAdmissao ? this.dataService.convertDateToISO(raw.dataAdmissao) : null,
      horarioEntrada: raw.horarioEntrada ? this.dataService.formatTimeForBackend(raw.horarioEntrada) : null,
      horarioSaida: raw.horarioSaida ? this.dataService.formatTimeForBackend(raw.horarioSaida) : null
    }

    const request$ = this.editVaga()
      ? this.vagaService.atualizarVaga(Number(cleaned.id), cleaned)
      : this.vagaService.criarVaga(Number(this.pessoaId()), cleaned);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.updated.emit(true); // 🔹 Avise o pai que terminou
        },
        error: (error) => {
          console.error('Erro ao salvar vaga:', error);
        }
      });
  }

}

import { Component, input, OnInit, signal, inject, output, effect, DestroyRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtestadoSaudeOcupacional, TipoAcrescimoSubstituicao, TipoContratante, TipoContrato, VagaFormData } from '../../entities/vagaFormData.model';
import { TitleCasePipe } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { VagaService } from '../../services/vaga-service';
import { DataService } from '../../services/data-service';
import { NotificationService } from '../../services/notification.service';
import { ClienteService } from '../../services/cliente.service';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { ClienteDTO } from '../../entities/cliente.model';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cadastro-vaga',
  imports: [ReactiveFormsModule, TitleCasePipe, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-vaga.html',
  styleUrl: './cadastro-vaga.css'
})
export class CadastroVaga implements OnInit {
  private fb = inject(FormBuilder);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private clienteService = inject(ClienteService);
  private tipoVagaService = inject(TipoVagaService);
  private notifications = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);
  editVaga = input<VagaFormData | null>(null);
  updated = output<boolean>();
  closeForm = output<void>();

  clientes = signal<ClienteDTO[]>([]);
  tiposVaga = signal<TipoVagaDTO[]>([]);

  form: FormGroup = this.fb.group({
    id: new FormControl<string | null>(null),
    cliente: new FormControl<string | null>(null),
    clienteId: new FormControl<number | null>(null),
    clienteNome: new FormControl<string | null>(null),
    tipoVagaId: new FormControl<number | null>(null),
    tipoVagaCodigo: new FormControl<string | null>(null),
    tipoVagaNome: new FormControl<string | null>(null),
    cidade: new FormControl<string | null>(null),
    uf: new FormControl<string | null>(null),
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
    this.carregarClientes();
    this.carregarTiposVaga();
  }

  patchForm() {
    const vaga = this.editVaga();
    this.editMode.set(!!vaga);

    if (!vaga) {
      this.form.reset();
      return;
    }

    const vagaFormatada: VagaFormData = {
      ...vaga,
      dataAdmissao: vaga.dataAdmissao ? this.dataService.convertISOToDateBR(vaga.dataAdmissao) : null,
      dataDemissao: vaga.dataDemissao ? this.dataService.convertISOToDateBR(vaga.dataDemissao) : null,
      horarioEntrada: vaga.horarioEntrada ? this.dataService.convertToLocalTime(vaga.horarioEntrada) : null,
      horarioSaida: vaga.horarioSaida ? this.dataService.convertToLocalTime(vaga.horarioSaida!) : null,
    } as VagaFormData;

    this.form.patchValue(vagaFormatada);
  }

  carregarClientes() {
    this.clienteService.listarAtivos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (clientes) => this.clientes.set(clientes),
        error: (error) => console.error('Erro ao carregar clientes:', error)
      });
  }

  carregarTiposVaga() {
    this.tipoVagaService.listarAtivos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tipos) => this.tiposVaga.set(tipos),
        error: (error) => console.error('Erro ao carregar tipos de vaga:', error)
      });
  }

  getEnumValues(enumObj: Record<string, string>): string[] {
    return Object.values(enumObj);
  }

  onCloseForm() {
    this.editMode.set(false);
    this.form.reset();
    this.closeForm.emit();
  }

  onSubmit() {
    const raw = this.form.getRawValue();

    const cleaned = {
      ...raw,
      dataDemissao: raw.dataDemissao ? this.dataService.convertDateToISO(raw.dataDemissao) : null,
      dataAdmissao: raw.dataAdmissao ? this.dataService.convertDateToISO(raw.dataAdmissao) : null,
      horarioEntrada: raw.horarioEntrada ? this.dataService.formatTimeForBackend(raw.horarioEntrada) : null,
      horarioSaida: raw.horarioSaida ? this.dataService.formatTimeForBackend(raw.horarioSaida) : null
    };

    const request$ = this.editVaga()
      ? this.vagaService.atualizarVaga(Number(cleaned.id), cleaned)
      : this.vagaService.criarVaga(Number(this.pessoaId()), cleaned);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success(this.editVaga() ? 'Vaga atualizada com sucesso.' : 'Vaga cadastrada com sucesso.');
          this.updated.emit(true);
        },
        error: () => {}
      });
  }

}

import { Component, input, OnInit, signal, inject, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtestadoSaudeOcupacional, TipoAcrescimoSubstituicao, TipoContratante, TipoContrato, VagaFormData } from '../../entities/vagaFormData.model';
import { TitleCasePipe } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { VagaService } from '../../services/vaga-service';
import { DataService } from '../../services/data-service';

@Component({
  selector: 'app-cadastro-vaga',
  imports: [ReactiveFormsModule, TitleCasePipe, NgxMaskDirective],
  providers: [provideNgxMask()],
  standalone: true,
  templateUrl: './cadastro-vaga.html',
  styleUrl: './cadastro-vaga.css'
})
export class CadastroVaga implements OnInit {
  private fb = inject(FormBuilder);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);

  pessoaId = input<string | null>(null);

  closeForm = output<void>();

  editMode = signal<boolean>(false);

  form!: FormGroup<{ [K in keyof VagaFormData]: FormControl<VagaFormData[K]> }>;

  TipoContrato = TipoContrato;
  TipoAcrescimoSubstituicao = TipoAcrescimoSubstituicao
  AtestadoSaudeOcupacional = AtestadoSaudeOcupacional;
  TipoContratante = TipoContratante;
  protected readonly Object = Object;

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.editMode.set(true);
    }

    this.form = this.fb.group({
      id: new FormControl<string | null>(null),
      cliente: new FormControl<string | null>(null),
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

  getEnumValues(enumObj: any): string[] {
    return Object.values(enumObj);
  }

  onCloseForm() {
    this.closeForm.emit();
  }

  onSubmit() {
    const raw = this.form.getRawValue();

    let cleaned = {
      ...raw,
      dataDemissao: raw.dataDemissao ? this.dataService.convertDateToISO(raw.dataDemissao) : null,
      dataAdmissao: raw.dataAdmissao ? this.dataService.convertDateToISO(raw.dataAdmissao) : null,
      horarioEntrada: raw.horarioEntrada ? this.dataService.convertToLocalTime(raw.horarioEntrada) : null,
      horarioSaida: raw.horarioSaida ? this.dataService.convertToLocalTime(raw.horarioSaida) : null,
    }

    this.vagaService.criarVaga(Number(this.pessoaId()), cleaned as VagaFormData).subscribe({
      next: (response) => {
        console.log('Vaga criada com sucesso:', response);
        this.onCloseForm();
      },
      error: (error) => {
        console.error('Erro ao criar vaga:', error);
      }
    });
  }

}

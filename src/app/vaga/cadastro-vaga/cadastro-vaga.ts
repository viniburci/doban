import { Component, input, OnInit, signal, inject, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtestadoSaudeOcupacional, TipoAcrescimoSubstituicao, TipoContratante, TipoContrato, VagaFormData } from '../../entities/vagaFormData.model';
import { TitleCasePipe } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
      contratante: new FormControl<TipoContratante | null>(null)
    });
  }

  getEnumValues(enumObj: any): string[] {
    return Object.values(enumObj);
  }

  onCloseForm() {
    this.closeForm.emit();
  }

  onSubmit() {
    console.log(this.form.value);
  }

}

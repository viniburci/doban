import { Component, input, OnInit, signal, inject, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AtestadoSaudeOcupacional, TipoAcrescimoSubstituicao, TipoContratante, TipoContrato, VagaFormData } from '../../entities/vagaFormData.model';

@Component({
  selector: 'app-cadastro-vaga',
  imports: [ReactiveFormsModule],
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

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.editMode.set(true);
    }

    this.form = this.fb.group({
      pessoaId: new FormControl(''),
      id: new FormControl(''),
      cliente: new FormControl(''),
      cidade: new FormControl(''),
      uf: new FormControl(''),
      cargo: new FormControl(''),
      setor: new FormControl(''),
      salario: new FormControl<number | null>(null),
      tipoContrato: new FormControl<TipoContrato | null>(null),
      dataAdmissao: new FormControl(''),
      dataDemissao: new FormControl(''),
      acrescimoOuSubstituicao: new FormControl<TipoAcrescimoSubstituicao | null>(null),
      aso: new FormControl<AtestadoSaudeOcupacional | null>(null),
      optanteVT: new FormControl<boolean | null>(null),
      horarioEntrada: new FormControl(''),
      horarioSaida: new FormControl(''),
      contratante: new FormControl<TipoContratante | null>(null)
    });
  }

  onCloseForm() {
    this.closeForm.emit();
  }

  onSubmit() {

  }

}

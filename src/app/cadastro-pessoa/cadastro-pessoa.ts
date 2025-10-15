import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PessoaFormData } from '../entities/pessoaFormaData.model';
import { PessoaService } from '../services/pessoa-service';

@Component({
  selector: 'app-cadastro-pessoa',
  imports: [FormsModule, CommonModule, FormsModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  standalone: true,
  providers: [provideNgxMask()],
  templateUrl: './cadastro-pessoa.html',
  styleUrl: './cadastro-pessoa.css'
})
export class CadastroPessoa implements OnInit {

  private pessoaService = inject(PessoaService);

  constructor(private fb: FormBuilder) { }

  form!: FormGroup<{ [K in keyof PessoaFormData]: FormControl<PessoaFormData[K]> }>;

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: new FormControl(''),
      email: new FormControl(''),
      telefone: new FormControl(''),
      dataNascimento: new FormControl(''),
      endereco: new FormControl(''),
      complemento: new FormControl(''),
      bairro: new FormControl(''),
      cidade: new FormControl(''),
      estado: new FormControl(''),
      cep: new FormControl(''),
      numeroCtps: new FormControl(''),
      serieCtps: new FormControl(''),
      dataEmissaoCtps: new FormControl(''),
      numeroRg: new FormControl(''),
      dataEmissaoRg: new FormControl(''),
      ufRg: new FormControl(''),
      cpf: new FormControl(''),
      pis: new FormControl(''),
      dataEmissaoPis: new FormControl(''),
      tituloEleitor: new FormControl(''),
      localNascimento: new FormControl(''),
      mae: new FormControl(''),
      pai: new FormControl(''),
      estadoCivil: new FormControl(''),
      categoriaCnh: new FormControl(''),
      numeroCnh: new FormControl(''),
      registroCnh: new FormControl(''),
      validadeCnh: new FormControl(''),
      chavePix: new FormControl(''),
    });
  }

  convertDateToISO = (rawDate: string): string => {
    if (!rawDate) return '';

    // Remove qualquer caractere que não seja número
    const onlyDigits = rawDate.replace(/\D/g, '');

    if (onlyDigits.length !== 8) return '';

    const dia = onlyDigits.slice(0, 2);
    const mes = onlyDigits.slice(2, 4);
    const ano = onlyDigits.slice(4, 8);

    return `${ano}-${mes}-${dia}`;
  };

  emptyStringsToNull<T>(obj: T): T {
    const result = {} as T;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === 'string' && value.trim() === '') {
          result[key] = null as any;
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }


  onSubmit() {
    const raw = this.form.getRawValue();

    let cleaned = this.emptyStringsToNull(raw);

    cleaned = {
      ...cleaned,
      dataNascimento: this.convertDateToISO(this.form.get('dataNascimento')?.value || ''),
      dataEmissaoCtps: this.convertDateToISO(this.form.get('dataEmissaoCtps')?.value || ''),
      dataEmissaoRg: this.convertDateToISO(this.form.get('dataEmissaoRg')?.value || ''),
      dataEmissaoPis: this.convertDateToISO(this.form.get('dataEmissaoPis')?.value || ''),
      validadeCnh: this.convertDateToISO(this.form.get('validadeCnh')?.value || ''),
    };

    console.log(cleaned);
    this.pessoaService.criarPessoa(cleaned).subscribe((response) => {
      console.log(response)
    });
  }
}

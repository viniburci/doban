import { Component, inject, input, OnInit, signal } from '@angular/core';
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

  pessoaId = input<string | null>(null);
  editMode = signal<boolean>(false);

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

    if (this.pessoaId()) {
      this.pessoaService.buscarPessoa(Number(this.pessoaId())).subscribe(response => {
        this.editMode.set(true);
        let data = this.convertDatesToBr(response);
        this.form.patchValue(data);
        console.log(data);
      })
    }

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

  convertISOToDateBR = (isoDate: string | null | undefined): string => {
    if (!isoDate) return '';

    // Verifica se está no formato ISO esperado
    const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return '';

    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
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

  convertDatesToBr(data: PessoaFormData) {
    let cleaned = this.emptyStringsToNull(data);

    cleaned = {
      ...cleaned,
      dataNascimento: this.convertISOToDateBR(data.dataNascimento ?? ''),
      dataEmissaoCtps: this.convertISOToDateBR(data.dataEmissaoCtps ?? ''),
      dataEmissaoRg: this.convertISOToDateBR(data.dataEmissaoRg ?? ''),
      dataEmissaoPis: this.convertISOToDateBR(data.dataEmissaoPis ?? ''),
      validadeCnh: this.convertISOToDateBR(data.validadeCnh ?? ''),
    };
    return cleaned;
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

    if(this.editMode()) {
      this.pessoaService.atualizarPessoa(Number(this.pessoaId()), cleaned).subscribe(response => console.log(response));
    } else {
      this.pessoaService.criarPessoa(cleaned).subscribe((response) => console.log(response));
    }
  }


}

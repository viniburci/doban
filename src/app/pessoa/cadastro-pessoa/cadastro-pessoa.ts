import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { PessoaService } from '../../services/pessoa-service';
import { DataService } from '../../services/data-service';

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
  private dataService = inject(DataService);

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
      // Campos de tamanho EPI
      tamanhoCamisa: new FormControl(''),
      tamanhoCalca: new FormControl(''),
      tamanhoCalcado: new FormControl(''),
      tamanhoLuva: new FormControl(''),
      tamanhoCapacete: new FormControl(''),
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
      dataNascimento: this.dataService.convertISOToDateBR(data.dataNascimento ?? ''),
      dataEmissaoCtps: this.dataService.convertISOToDateBR(data.dataEmissaoCtps ?? ''),
      dataEmissaoRg: this.dataService.convertISOToDateBR(data.dataEmissaoRg ?? ''),
      dataEmissaoPis: this.dataService.convertISOToDateBR(data.dataEmissaoPis ?? ''),
      validadeCnh: this.dataService.convertISOToDateBR(data.validadeCnh ?? ''),
    };
    return cleaned;
  }

  onSubmit() {
    const raw = this.form.getRawValue();

    let cleaned = this.emptyStringsToNull(raw);

    cleaned = {
      ...cleaned,
      dataNascimento: this.dataService.convertDateToISO(this.form.get('dataNascimento')?.value || ''),
      dataEmissaoCtps: this.dataService.convertDateToISO(this.form.get('dataEmissaoCtps')?.value || ''),
      dataEmissaoRg: this.dataService.convertDateToISO(this.form.get('dataEmissaoRg')?.value || ''),
      dataEmissaoPis: this.dataService.convertDateToISO(this.form.get('dataEmissaoPis')?.value || ''),
      validadeCnh: this.dataService.convertDateToISO(this.form.get('validadeCnh')?.value || ''),
    };

    console.log(cleaned);

    if(this.editMode()) {
      this.pessoaService.atualizarPessoa(Number(this.pessoaId()), cleaned).subscribe(response => console.log(response));
    } else {
      this.pessoaService.criarPessoa(cleaned).subscribe((response) => console.log(response));
    }
  }


}

import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro-pessoa',
  imports: [FormsModule, CommonModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-pessoa.html',
  styleUrl: './cadastro-pessoa.css'
})
export class CadastroPessoa {

  possuiCnh = signal<boolean>(false);
  lastSubmission = signal<Date | null>(null);

  form = new FormGroup({
    nome: new FormControl(''),
    email: new FormControl(''),
    telefone: new FormControl(''),
    dataNascimento: new FormControl(''),
    endereco: new FormControl(''),
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
    dataEmissaoPis : new FormControl(''),
    tituloEleitor: new FormControl(''), 
    localNascimento: new FormControl(''), 
    mae: new FormControl(''),
    pai: new FormControl(''),
    estadoCivil: new FormControl(''),
    categoriaCnh: new FormControl(''),
    numeroCnh: new FormControl({value: '', disabled: this.possuiCnh()}),
    registroCnh: new FormControl({value: '', disabled: this.possuiCnh()}),
    validadeCnh: new FormControl({value: '', disabled: this.possuiCnh()}),
    chavePix: new FormControl(''),
  });


  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted');
    console.log(this.form.value);
  }
}

import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-pessoa',
  imports: [],
  templateUrl: './cadastro-pessoa.html',
  styleUrl: './cadastro-pessoa.css'
})
export class CadastroPessoa {

  lastSubmission = signal<Date | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted');
  }
}

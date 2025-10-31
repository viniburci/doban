import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecursoCelularRequestDTO } from '../../../entities/recursoCelularRequestDTO.model';

@Component({
  selector: 'app-cadastro-recurso-celular',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-recurso-celular.html',
  styleUrl: './cadastro-recurso-celular.css'
})
export class CadastroRecursoCelular implements OnInit {

  private fb = inject(FormBuilder);

  editMode = signal<boolean>(false);
  pessoaId = input<string | null>(null);
  closeForm = output<void>();

  form!: FormGroup<{ [K in keyof RecursoCelularRequestDTO]: FormControl<RecursoCelularRequestDTO[K]> }>;

  ngOnInit() {
    this.form = this.fb.group({
      celularId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  onCloseForm() {
    this.closeForm.emit();
  }
}

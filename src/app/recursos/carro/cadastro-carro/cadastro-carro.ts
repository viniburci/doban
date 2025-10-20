import { Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CarroFormData } from '../../../entities/carroFormData.model';
import { CarroService } from '../../../services/carro-service';

@Component({
  selector: 'app-cadastro-carro',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-carro.html',
  styleUrl: './cadastro-carro.css'
})
export class CadastroCarro implements OnInit{
  
  constructor(private fb: FormBuilder, private carroService: CarroService) { }

  carroId = input<string | null>(null);
  editMode = signal<boolean>(false);

  form!: FormGroup<{ [K in keyof CarroFormData]: FormControl<CarroFormData[K]> }>;

  ngOnInit() {
    this.form = this.fb.group({
      marca: new FormControl(''),
      modelo: new FormControl(''),
      cor: new FormControl(''),
      chassi: new FormControl(''),
      placa: new FormControl(''),
      anoModelo: new FormControl('')
    })

    if (this.carroId()) {
      this.carroService.buscar(Number(this.carroId())).subscribe(response => {
        this.editMode.set(true);
        this.form.patchValue(response);
        console.log(response);
      })
    }
  }

  onSubmit() {
    if(this.editMode()) {
      this.carroService.atualizar(Number(this.carroId()), this.form.getRawValue()).subscribe(data => console.log(data))
    } else {
      this.carroService.criar(this.form.getRawValue()).subscribe(data => console.log(data));
    }
  }
}

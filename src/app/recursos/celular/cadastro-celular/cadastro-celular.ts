import { Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CelularFormData } from '../../../entities/celularFormData.model';
import { CelularService } from '../../../services/celular-service';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-celular',
  imports: [ReactiveFormsModule],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-celular.html',
  styleUrl: './cadastro-celular.css'
})
export class CadastroCelular implements OnInit {

  constructor(private fb: FormBuilder, private celularService: CelularService) { }

  celularId = input<string | null>(null);
  editMode = signal<boolean>(false);

  form!: FormGroup<{ [K in keyof CelularFormData]: FormControl<CelularFormData[K]> }>;

  ngOnInit() {
    this.form = this.fb.group({
      marca: new FormControl(''),
      modelo: new FormControl(''),
      chip: new FormControl(''),
      imei: new FormControl('')
    })

    if (this.celularId()) {
      this.celularService.buscar(Number(this.celularId())).subscribe(response => {
        this.editMode.set(true);
        this.form.patchValue(response);
        console.log(response);
      })
    }
  }

  onSubmit() {
    if(this.editMode()) {
      this.celularService.atualizar(Number(this.celularId()), this.form.getRawValue()).subscribe(data => console.log(data))
    } else {
      this.celularService.criar(this.form.getRawValue()).subscribe(data => console.log(data));
    }
  }

}

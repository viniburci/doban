import { Component, input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RocadeiraService } from '../../../services/rocadeira-service';
import { RocadeiraRequestDTO } from '../../../entities/rocadeiraRequestDTO.model';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-rocadeira',
  imports: [ReactiveFormsModule],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-rocadeira.html',
  styleUrl: './cadastro-rocadeira.css'
})
export class CadastroRocadeira {
constructor(private fb: FormBuilder, private rocadeiraService: RocadeiraService) { }

  rocadeiraId = input<string | null>(null);
  editMode = signal<boolean>(false);

  form!: FormGroup<{ [K in keyof RocadeiraRequestDTO]: FormControl<RocadeiraRequestDTO[K]> }>;

  ngOnInit() {
    this.form = this.fb.group({
      marca: new FormControl(''),
      numeroSerie: new FormControl('')
    });

    if (this.rocadeiraId()) {
      this.rocadeiraService.buscarPorId(Number(this.rocadeiraId())).subscribe(response => {
        this.editMode.set(true);
        this.form.patchValue(response);
        console.log(response);
      })
    }
  }

  onSubmit() {
    if(this.editMode()) {
      this.rocadeiraService.atualizarRocadeira(Number(this.rocadeiraId()), this.form.getRawValue()).subscribe(data => console.log(data))
    } else {
      this.rocadeiraService.criarRocadeira(this.form.getRawValue()).subscribe(data => console.log(data));
    }
  }
}

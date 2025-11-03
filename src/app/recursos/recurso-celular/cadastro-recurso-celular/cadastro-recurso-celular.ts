import { AfterViewInit, ChangeDetectorRef, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CelularService } from '../../../services/celular-service';
import { RecursoCelularRequestDTO } from '../../../entities/recursoCelularRequestDTO.model';
import { RecursoCelularResponseDTO } from '../../../entities/recursoCelularResponseDTO.model';
import { CelularFormData } from '../../../entities/celularFormData.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DataService } from '../../../services/data-service';

@Component({
  selector: 'app-cadastro-recurso-celular',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-celular.html',
  styleUrl: './cadastro-recurso-celular.css'
})
export class CadastroRecursoCelular implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private celularService = inject(CelularService);
  private dataService = inject(DataService);

  editMode = signal<boolean>(false);
  pessoaId = input<string | null>(null);
  listaCelulares = signal<CelularFormData[] | null>(null);
  closeForm = output<void>();

  form!: FormGroup<{ [K in keyof RecursoCelularRequestDTO]: FormControl<RecursoCelularRequestDTO[K]> }>;

  ngOnInit() {
    this.form = this.fb.group({
      celularId: new FormControl<string | null>(null),
      pessoaId: new FormControl<string | null>(null),
      dataEntrega: new FormControl<string | null>(null),
      dataDevolucao: new FormControl<string | null>(null),
    });
    this.celularService.listar().subscribe(data => this.listaCelulares.set(data));
  }

  onSubmit() {
    console.log({...this.form.value,
        pessoaId: this.pessoaId(), 
        dataEntrega: this.dataService.convertDateToISO(this.form.value.dataEntrega!),
        dataDevolucao: this.dataService.convertDateToISO(this.form.value.dataDevolucao!)
      } as RecursoCelularRequestDTO);

  }

  onCloseForm() {
    this.closeForm.emit();
  }

  ngAfterViewInit() {
    setTimeout(() => this.cdRef.detectChanges());
  }
}

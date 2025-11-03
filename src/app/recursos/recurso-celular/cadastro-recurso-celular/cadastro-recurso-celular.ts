import { ChangeDetectorRef, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CelularService } from '../../../services/celular-service';
import { RecursoCelularRequestDTO } from '../../../entities/recursoCelularRequestDTO.model';
import { RecursoCelularResponseDTO } from '../../../entities/recursoCelularResponseDTO.model';
import { CelularFormData } from '../../../entities/celularFormData.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DataService } from '../../../services/data-service';
import { RecursoService } from '../../../services/recurso-service';

@Component({
  selector: 'app-cadastro-recurso-celular',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './cadastro-recurso-celular.html',
  styleUrl: './cadastro-recurso-celular.css'
})
export class CadastroRecursoCelular implements OnInit {

  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private recursoService = inject(RecursoService);
  private celularService = inject(CelularService);
  private dataService = inject(DataService);

  pessoaId = input<string | null>(null);
  editMode = input<boolean>(false);
  updated = output<void>();
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
    const cleaned = ({
      ...this.form.value,
      pessoaId: this.pessoaId(),
      dataEntrega: this.dataService.convertDateToISO(this.form.value.dataEntrega!),
      dataDevolucao: this.dataService.convertDateToISO(this.form.value.dataDevolucao!)
    } as RecursoCelularRequestDTO);

    const request$ = this.recursoService.createRecursoCelular(cleaned);

    request$.subscribe({
      next: (response: RecursoCelularResponseDTO) => {
        console.log('Recurso celular criado com sucesso:', response);
        this.updated.emit();
        this.onCloseForm();
      },
      error: (error) => {
        console.error('Erro ao criar recurso celular:', error);
      }
    });

  }

  onCloseForm() {
    this.closeForm.emit();
  }
}

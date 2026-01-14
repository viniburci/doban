import { ChangeDetectionStrategy, Component, OnInit, signal, input, output, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecursoDinamicoService } from '../../../services/recurso-dinamico.service';
import { ItemDinamicoService } from '../../../services/item-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';
import { ItemDinamicoDTO } from '../../../entities/item-dinamico.model';
import { RecursoDinamicoDTO } from '../../../entities/recurso-dinamico.model';

@Component({
  selector: 'app-form-recurso-dinamico',
  imports: [ReactiveFormsModule],
  templateUrl: './form-recurso-dinamico.html',
  styleUrl: './form-recurso-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormRecursoDinamico implements OnInit {
  private fb = inject(FormBuilder);
  private recursoDinamicoService = inject(RecursoDinamicoService);
  private itemDinamicoService = inject(ItemDinamicoService);
  private tipoRecursoService = inject(TipoRecursoService);

  pessoaId = input.required<string | null>();
  editRecurso = input<RecursoDinamicoDTO | null>(null);

  updated = output<void>();
  closeForm = output<void>();

  loading = signal(false);
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  itensDisponiveis = signal<ItemDinamicoDTO[]>([]);

  form!: FormGroup;

  isEditMode = signal(false);

  constructor() {
    effect(() => {
      const recurso = this.editRecurso();
      if (recurso) {
        this.isEditMode.set(true);
        this.preencherFormularioEdicao(recurso);
      }
    });
  }

  ngOnInit() {
    const hoje = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      tipoRecursoCodigo: new FormControl('', { nonNullable: true }),
      itemId: new FormControl<number | null>(null, { validators: [Validators.required] }),
      dataEntrega: new FormControl(hoje, { nonNullable: true, validators: [Validators.required] }),
      dataDevolucao: new FormControl<string | null>(null)
    });

    this.carregarTiposRecurso();
  }

  carregarTiposRecurso() {
    this.tipoRecursoService.listarTodos().subscribe({
      next: (response) => {
        this.tiposRecurso.set(response.filter(t => t.ativo));
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de recurso', error);
      }
    });
  }

  preencherFormularioEdicao(recurso: RecursoDinamicoDTO) {
    const dataDevolucao = new Date().toISOString().split('T')[0];

    this.form.patchValue({
      tipoRecursoCodigo: recurso.item.tipoRecursoCodigo,
      itemId: recurso.item.id,
      dataEntrega: recurso.dataEntrega,
      dataDevolucao: dataDevolucao
    });

    this.form.controls['tipoRecursoCodigo'].disable();
    this.form.controls['itemId'].disable();
    this.form.controls['dataEntrega'].disable();
    this.form.controls['dataDevolucao'].enable();
    this.form.controls['dataDevolucao'].setValidators([Validators.required]);

    this.itensDisponiveis.set([recurso.item]);
  }

  onTipoChange(codigo: string) {
    this.form.controls['itemId'].setValue(null);
    this.itensDisponiveis.set([]);

    if (codigo) {
      this.itemDinamicoService.listarDisponiveis(codigo).subscribe({
        next: (response) => {
          this.itensDisponiveis.set(response);
        },
        error: (error) => {
          console.error('Erro ao carregar itens disponíveis', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    if (this.isEditMode()) {
      this.registrarDevolucao();
    } else {
      this.criarEmprestimo();
    }
  }

  criarEmprestimo() {
    const formValue = this.form.getRawValue();
    const pessoaIdNumber = Number(this.pessoaId());

    this.recursoDinamicoService.emprestar({
      pessoaId: pessoaIdNumber,
      itemId: formValue.itemId!,
      dataEntrega: formValue.dataEntrega
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.updated.emit();
      },
      error: (error) => {
        console.error('Erro ao registrar empréstimo', error);
        this.loading.set(false);
      }
    });
  }

  registrarDevolucao() {
    const formValue = this.form.getRawValue();
    const recursoId = this.editRecurso()!.id!;

    this.recursoDinamicoService.registrarDevolucao(recursoId, {
      dataDevolucao: formValue.dataDevolucao!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.updated.emit();
      },
      error: (error) => {
        console.error('Erro ao registrar devolução', error);
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.closeForm.emit();
  }
}

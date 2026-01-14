import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecursoDinamicoService } from '../../../services/recurso-dinamico.service';
import { ItemDinamicoService } from '../../../services/item-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';
import { ItemDinamicoDTO } from '../../../entities/item-dinamico.model';
import { PessoaService } from '../../../services/pessoa-service';

interface PessoaResumo {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-cadastro-recurso-dinamico',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-recurso-dinamico.html',
  styleUrl: './cadastro-recurso-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroRecursoDinamico implements OnInit {
  loading = signal(false);
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  itensDisponiveis = signal<ItemDinamicoDTO[]>([]);
  pessoas = signal<PessoaResumo[]>([]);

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recursoDinamicoService: RecursoDinamicoService,
    private itemDinamicoService: ItemDinamicoService,
    private tipoRecursoService: TipoRecursoService,
    private pessoaService: PessoaService,
    private router: Router
  ) {}

  ngOnInit() {
    const hoje = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      tipoRecursoCodigo: new FormControl('', { nonNullable: true }),
      pessoaId: new FormControl<number | null>(null, { validators: [Validators.required] }),
      itemId: new FormControl<number | null>(null, { validators: [Validators.required] }),
      dataEntrega: new FormControl(hoje, { nonNullable: true, validators: [Validators.required] })
    });

    this.carregarTiposRecurso();
    this.carregarPessoas();
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

  carregarPessoas() {
    this.pessoaService.buscarTodasPessoas().subscribe({
      next: (response) => {
        const resumoPessoas = response.map(p => ({ id: p.id!, nome: p.nome! }));
        this.pessoas.set(resumoPessoas);
      },
      error: (error) => {
        console.error('Erro ao carregar pessoas', error);
      }
    });

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

    const formValue = this.form.getRawValue();

    this.recursoDinamicoService.emprestar({
      pessoaId: formValue.pessoaId!,
      itemId: formValue.itemId!,
      dataEntrega: formValue.dataEntrega
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/emprestimos']);
      },
      error: (error) => {
        console.error('Erro ao registrar empréstimo', error);
        this.loading.set(false);
      }
    });
  }
}

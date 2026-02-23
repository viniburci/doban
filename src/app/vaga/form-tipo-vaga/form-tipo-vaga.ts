import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TipoVagaCreateDTO } from '../../entities/tipo-vaga.model';
import { CAMPOS_TAMANHO_PESSOA, ItemPadrao } from '../../entities/template-documento.model';

@Component({
  selector: 'app-form-tipo-vaga',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-tipo-vaga.html',
  styleUrl: './form-tipo-vaga.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormTipoVaga implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tipoVagaService = inject(TipoVagaService);

  tipoVagaId = input<string | null>(null);

  form!: FormGroup;
  itensPadrao = signal<ItemPadrao[]>([]);

  loading = signal(false);
  salvando = signal(false);
  editMode = signal(false);

  camposTamanhoPessoa = CAMPOS_TAMANHO_PESSOA;

  ngOnInit() {
    this.initForm();

    const id = this.tipoVagaId();
    if (id && !isNaN(Number(id))) {
      this.editMode.set(true);
      this.carregarTipoVaga(Number(id));
    }
  }

  initForm() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['']
    });
  }

  carregarTipoVaga(id: number) {
    this.loading.set(true);
    this.tipoVagaService.buscarPorId(id).subscribe({
      next: (tipo) => {
        this.form.patchValue({
          codigo: tipo.codigo,
          nome: tipo.nome,
          descricao: tipo.descricao || ''
        });

        if (tipo.itensPadrao) {
          this.itensPadrao.set([...tipo.itensPadrao]);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tipo de vaga:', err);
        this.loading.set(false);
      }
    });
  }

  // Itens Padrao
  adicionarItemPadrao() {
    const novoItem: ItemPadrao = {
      descricao: '',
      quantidade: 1
    };
    this.itensPadrao.update(items => [...items, novoItem]);
  }

  removerItemPadrao(index: number) {
    this.itensPadrao.update(items => items.filter((_, i) => i !== index));
  }

  atualizarItemPadrao(index: number, campo: string, valor: unknown) {
    this.itensPadrao.update(items =>
      items.map((item, i) => i === index ? { ...item, [campo]: valor } : item)
    );
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.salvando.set(true);

    const dto: TipoVagaCreateDTO = {
      ...this.form.value,
      itensPadrao: this.itensPadrao().length > 0 ? this.itensPadrao() : undefined
    };

    const operacao = this.editMode()
      ? this.tipoVagaService.atualizar(Number(this.tipoVagaId()), dto)
      : this.tipoVagaService.criar(dto);

    operacao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/tipos-vaga']);
      },
      error: (err) => {
        console.error('Erro ao salvar tipo de vaga:', err);
        this.salvando.set(false);
      }
    });
  }
}

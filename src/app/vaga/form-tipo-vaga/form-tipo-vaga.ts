import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TipoRecursoService } from '../../services/tipo-recurso.service';
import { TipoVagaCreateDTO } from '../../entities/tipo-vaga.model';
import { TipoRecursoDTO } from '../../entities/tipo-recurso.model';
import { FieldDefinition, FieldType } from '../../entities/field-schema.model';
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
  private tipoRecursoService = inject(TipoRecursoService);

  tipoVagaId = input<string | null>(null);

  form!: FormGroup;
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  schemaFields = signal<FieldDefinition[]>([]);
  itensPadrao = signal<ItemPadrao[]>([]);
  recursosPermitidosIds = signal<number[]>([]);

  loading = signal(false);
  salvando = signal(false);
  editMode = signal(false);

  fieldTypes: FieldType[] = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'ENUM'];
  camposTamanhoPessoa = CAMPOS_TAMANHO_PESSOA;

  ngOnInit() {
    this.initForm();
    this.carregarTiposRecurso();

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

  carregarTiposRecurso() {
    this.tipoRecursoService.listarAtivos().subscribe({
      next: (data) => this.tiposRecurso.set(data),
      error: (err) => console.error('Erro ao carregar tipos de recurso:', err)
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

        if (tipo.schema?.fields) {
          this.schemaFields.set([...tipo.schema.fields]);
        }

        if (tipo.itensPadrao) {
          this.itensPadrao.set([...tipo.itensPadrao]);
        }

        if (tipo.recursosPermitidos) {
          this.recursosPermitidosIds.set(tipo.recursosPermitidos.map(r => r.id));
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tipo de vaga:', err);
        this.loading.set(false);
      }
    });
  }

  // Schema Fields
  adicionarCampoSchema() {
    const novoCampo: FieldDefinition = {
      nome: '',
      rotulo: '',
      tipo: 'STRING',
      obrigatorio: false
    };
    this.schemaFields.update(fields => [...fields, novoCampo]);
  }

  removerCampoSchema(index: number) {
    this.schemaFields.update(fields => fields.filter((_, i) => i !== index));
  }

  atualizarCampoSchema(index: number, campo: string, valor: unknown) {
    this.schemaFields.update(fields =>
      fields.map((f, i) => i === index ? { ...f, [campo]: valor } : f)
    );
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

  // Recursos Permitidos
  toggleRecursoPermitido(recursoId: number) {
    this.recursosPermitidosIds.update(ids => {
      if (ids.includes(recursoId)) {
        return ids.filter(id => id !== recursoId);
      }
      return [...ids, recursoId];
    });
  }

  isRecursoPermitido(recursoId: number): boolean {
    return this.recursosPermitidosIds().includes(recursoId);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.salvando.set(true);

    const dto: TipoVagaCreateDTO = {
      ...this.form.value,
      schema: this.schemaFields().length > 0 ? { fields: this.schemaFields() } : null,
      itensPadrao: this.itensPadrao().length > 0 ? this.itensPadrao() : undefined,
      recursosPermitidosIds: this.recursosPermitidosIds().length > 0 ? this.recursosPermitidosIds() : undefined
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

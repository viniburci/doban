import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TemplateDocumentoService } from '../../services/template-documento.service';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TemplateDocumentoCreate } from '../../entities/template-documento.model';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';
import { FieldDefinition, FieldType } from '../../entities/field-schema.model';
import { VARIAVEIS_TEMPLATE, CategoriaVariaveis, VariavelTemplate } from './variaveis-template.const';

@Component({
  selector: 'app-form-template',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-template.html',
  styleUrl: './form-template.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormTemplate implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private templateService = inject(TemplateDocumentoService);
  private tipoVagaService = inject(TipoVagaService);

  @ViewChild('htmlEditor') htmlEditor!: ElementRef<HTMLTextAreaElement>;

  templateId = input<string | null>(null);

  form!: FormGroup;
  tiposVaga = signal<TipoVagaDTO[]>([]);
  schemaFields = signal<FieldDefinition[]>([]);
  variaveisSelecionadas = signal<Set<string>>(new Set());
  variaveisCustomizadas = signal<string[]>([]);
  categoriasExpandidas = signal<Set<string>>(new Set(['Pessoa', 'Vaga']));
  loading = signal(false);
  salvando = signal(false);
  editMode = signal(false);
  mensagemCopiado = signal<string | null>(null);

  fieldTypes: FieldType[] = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'ENUM'];
  categoriasVariaveis: CategoriaVariaveis[] = VARIAVEIS_TEMPLATE;

  // Variaveis derivadas do schema - aparecem dinamicamente conforme o usuario define campos
  variaveisDoSchema = computed<VariavelTemplate[]>(() => {
    return this.schemaFields()
      .filter(field => field.nome?.trim())
      .map(field => ({
        nome: `item.${field.nome}`,
        rotulo: field.rotulo || field.nome,
        thymeleaf: `\${item.${field.nome}}`
      }));
  });

  ngOnInit() {
    this.initForm();
    this.carregarTiposVaga();

    const id = this.templateId();
    if (id && !isNaN(Number(id))) {
      this.editMode.set(true);
      this.carregarTemplate(Number(id));
    }
  }

  initForm() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      conteudoHtml: ['', Validators.required],
      tiposVagaPermitidosIds: [[]]
    });
  }

  carregarTiposVaga() {
    this.tipoVagaService.listarAtivos().subscribe({
      next: (data) => this.tiposVaga.set(data),
      error: (err) => console.error('Erro ao carregar tipos de vaga:', err)
    });
  }

  carregarTemplate(id: number) {
    this.loading.set(true);
    this.templateService.buscarPorId(id).subscribe({
      next: (template) => {
        this.form.patchValue({
          codigo: template.codigo,
          nome: template.nome,
          descricao: template.descricao || '',
          conteudoHtml: template.conteudoHtml,
          tiposVagaPermitidosIds: template.tiposVagaPermitidos?.map(t => t.id) || []
        });

        if (template.schemaItens?.fields) {
          this.schemaFields.set([...template.schemaItens.fields]);
        }

        if (template.variaveisDisponiveis) {
          const variaveisPredefinidas = this.obterTodasVariaveisPredefinidas();
          const selecionadas = new Set<string>();
          const customizadas: string[] = [];

          template.variaveisDisponiveis.forEach(v => {
            if (variaveisPredefinidas.has(v)) {
              selecionadas.add(v);
            } else {
              customizadas.push(v);
            }
          });

          this.variaveisSelecionadas.set(selecionadas);
          this.variaveisCustomizadas.set(customizadas);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar template:', err);
        this.loading.set(false);
      }
    });
  }

  obterTodasVariaveisPredefinidas(): Set<string> {
    const todas = new Set<string>();
    this.categoriasVariaveis.forEach(cat => {
      cat.variaveis.forEach(v => todas.add(v.nome));
    });
    return todas;
  }

  // Variaveis - Selecao
  toggleCategoria(categoria: string) {
    this.categoriasExpandidas.update(set => {
      const novo = new Set(set);
      if (novo.has(categoria)) {
        novo.delete(categoria);
      } else {
        novo.add(categoria);
      }
      return novo;
    });
  }

  isCategoriaExpandida(categoria: string): boolean {
    return this.categoriasExpandidas().has(categoria);
  }

  toggleVariavel(nome: string) {
    this.variaveisSelecionadas.update(set => {
      const novo = new Set(set);
      if (novo.has(nome)) {
        novo.delete(nome);
      } else {
        novo.add(nome);
      }
      return novo;
    });
  }

  isVariavelSelecionada(nome: string): boolean {
    return this.variaveisSelecionadas().has(nome);
  }

  selecionarTodosCategoria(categoria: CategoriaVariaveis) {
    this.variaveisSelecionadas.update(set => {
      const novo = new Set(set);
      categoria.variaveis.forEach(v => novo.add(v.nome));
      return novo;
    });
  }

  desmarcarTodosCategoria(categoria: CategoriaVariaveis) {
    this.variaveisSelecionadas.update(set => {
      const novo = new Set(set);
      categoria.variaveis.forEach(v => novo.delete(v.nome));
      return novo;
    });
  }

  todosCategoriaSelecionados(categoria: CategoriaVariaveis): boolean {
    return categoria.variaveis.every(v => this.variaveisSelecionadas().has(v.nome));
  }

  // Variaveis customizadas
  adicionarVariavelCustomizada() {
    this.variaveisCustomizadas.update(vars => [...vars, '']);
  }

  removerVariavelCustomizada(index: number) {
    this.variaveisCustomizadas.update(vars => vars.filter((_, i) => i !== index));
  }

  atualizarVariavelCustomizada(index: number, valor: string) {
    this.variaveisCustomizadas.update(vars =>
      vars.map((v, i) => i === index ? valor : v)
    );
  }

  // Inserir no HTML
  inserirNoHtml(variavel: VariavelTemplate) {
    const textarea = this.htmlEditor?.nativeElement;
    if (!textarea) return;

    const codigo = variavel.nome.startsWith('item.') || variavel.nome === 'itens'
      ? variavel.thymeleaf
      : `<span th:text="${variavel.thymeleaf}"></span>`;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textoAtual = this.form.get('conteudoHtml')?.value || '';

    const novoTexto = textoAtual.substring(0, start) + codigo + textoAtual.substring(end);
    this.form.patchValue({ conteudoHtml: novoTexto });

    // Reposiciona cursor apos o texto inserido
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + codigo.length;
    }, 0);

    // Seleciona a variavel automaticamente
    if (!this.variaveisSelecionadas().has(variavel.nome)) {
      this.toggleVariavel(variavel.nome);
    }

    // Feedback visual
    this.mensagemCopiado.set(variavel.rotulo);
    setTimeout(() => this.mensagemCopiado.set(null), 1500);
  }

  copiarThymeleaf(variavel: VariavelTemplate, event: Event) {
    event.stopPropagation();
    const codigo = `th:text="${variavel.thymeleaf}"`;
    navigator.clipboard.writeText(codigo);

    this.mensagemCopiado.set(variavel.rotulo);
    setTimeout(() => this.mensagemCopiado.set(null), 1500);
  }

  // Schema de itens
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

  // Tipos de vaga
  toggleTipoVaga(tipoId: number) {
    const atual = this.form.get('tiposVagaPermitidosIds')?.value || [];
    const index = atual.indexOf(tipoId);

    if (index === -1) {
      this.form.patchValue({ tiposVagaPermitidosIds: [...atual, tipoId] });
    } else {
      this.form.patchValue({ tiposVagaPermitidosIds: atual.filter((id: number) => id !== tipoId) });
    }
  }

  isTipoVagaSelecionado(tipoId: number): boolean {
    const selecionados = this.form.get('tiposVagaPermitidosIds')?.value || [];
    return selecionados.includes(tipoId);
  }

  // Submit
  onSubmit() {
    if (this.form.invalid) return;

    this.salvando.set(true);

    // Combina variaveis selecionadas + customizadas
    const todasVariaveis = [
      ...Array.from(this.variaveisSelecionadas()),
      ...this.variaveisCustomizadas().filter(v => v.trim() !== '')
    ];

    const dto: TemplateDocumentoCreate = {
      ...this.form.value,
      schemaItens: this.schemaFields().length > 0 ? { fields: this.schemaFields() } : null,
      variaveisDisponiveis: todasVariaveis
    };

    const operacao = this.editMode()
      ? this.templateService.atualizar(Number(this.templateId()), dto)
      : this.templateService.criar(dto);

    operacao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/templates-documento']);
      },
      error: (err) => {
        console.error('Erro ao salvar template:', err);
        this.salvando.set(false);
      }
    });
  }
}

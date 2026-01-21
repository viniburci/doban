import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentoDinamicoService } from '../../services/documento-dinamico.service';
import { TemplateDocumentoService } from '../../services/template-documento.service';
import { DadosTemplate, ItemPadrao, TemplateDocumento } from '../../entities/template-documento.model';
import { FieldDefinition } from '../../entities/field-schema.model';

@Component({
  selector: 'app-gerador-documento',
  imports: [FormsModule],
  templateUrl: './gerador-documento.html',
  styleUrl: './gerador-documento.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeradorDocumento {
  private documentoDinamicoService = inject(DocumentoDinamicoService);
  private templateDocumentoService = inject(TemplateDocumentoService);

  vagaId = input.required<number>();
  closeForm = output<void>();

  templates = signal<TemplateDocumento[]>([]);
  templateSelecionado = signal<TemplateDocumento | null>(null);
  dadosTemplate = signal<DadosTemplate | null>(null);
  itens = signal<ItemPadrao[]>([]);

  carregando = signal(false);
  gerando = signal(false);
  previewHtml = signal<string | null>(null);
  mostrarPreview = signal(false);

  schemaFields = computed<FieldDefinition[]>(() => {
    const dados = this.dadosTemplate();
    return dados?.schemaItens?.fields ?? [];
  });

  temItens = computed(() => this.itens().length > 0);

  constructor() {
    this.carregarTemplates();
  }

  carregarTemplates() {
    this.templateDocumentoService.listarAtivos().subscribe({
      next: (templates) => this.templates.set(templates),
      error: (err) => console.error('Erro ao carregar templates:', err)
    });
  }

  selecionarTemplate(templateId: number) {
    const template = this.templates().find(t => t.id === templateId);
    if (!template) return;

    this.templateSelecionado.set(template);
    this.carregarDadosTemplate(template.codigo);
  }

  carregarDadosTemplate(templateCodigo: string) {
    this.carregando.set(true);
    this.previewHtml.set(null);
    this.mostrarPreview.set(false);

    this.documentoDinamicoService.obterDadosTemplate(templateCodigo, this.vagaId()).subscribe({
      next: (dados) => {
        this.dadosTemplate.set(dados);
        this.itens.set([...dados.itens]);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do template:', err);
        this.carregando.set(false);
      }
    });
  }

  adicionarItem() {
    const fields = this.schemaFields();
    const novoItem: ItemPadrao = {
      descricao: '',
      quantidade: 1
    };

    for (const field of fields) {
      if (field.nome !== 'descricao' && field.nome !== 'quantidade') {
        novoItem[field.nome] = field.valorPadrao ?? '';
      }
    }

    this.itens.update(items => [...items, novoItem]);
  }

  removerItem(index: number) {
    this.itens.update(items => items.filter((_, i) => i !== index));
  }

  atualizarItem(index: number, campo: string, valor: unknown) {
    this.itens.update(items =>
      items.map((item, i) => i === index ? { ...item, [campo]: valor } : item)
    );
  }

  visualizarPreview() {
    const template = this.templateSelecionado();
    if (!template) return;

    this.carregando.set(true);

    this.documentoDinamicoService.previewDocumento(template.codigo, this.vagaId()).subscribe({
      next: (html) => {
        this.previewHtml.set(html);
        this.mostrarPreview.set(true);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao gerar preview:', err);
        this.carregando.set(false);
      }
    });
  }

  fecharPreview() {
    this.mostrarPreview.set(false);
  }

  gerarDocumento() {
    const template = this.templateSelecionado();
    if (!template) return;

    this.gerando.set(true);

    this.documentoDinamicoService.gerarDocumento(template.codigo, this.vagaId(), {
      itens: this.itens()
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerando.set(false);
      },
      error: (err) => {
        console.error('Erro ao gerar documento:', err);
        this.gerando.set(false);
      }
    });
  }

  fechar() {
    this.closeForm.emit();
  }

  getInputType(tipo: string): string {
    switch (tipo) {
      case 'INTEGER':
      case 'DECIMAL':
        return 'number';
      case 'DATE':
        return 'date';
      case 'DATETIME':
        return 'datetime-local';
      case 'BOOLEAN':
        return 'checkbox';
      default:
        return 'text';
    }
  }
}

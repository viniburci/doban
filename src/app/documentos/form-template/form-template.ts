import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TemplateDocumentoService } from '../../services/template-documento.service';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { TemplateDocumento, TemplateDocumentoCreate } from '../../entities/template-documento.model';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';
import { FieldDefinition, FieldType } from '../../entities/field-schema.model';

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

  templateId = input<string | null>(null);

  form!: FormGroup;
  tiposVaga = signal<TipoVagaDTO[]>([]);
  schemaFields = signal<FieldDefinition[]>([]);
  variaveisDisponiveis = signal<string[]>([]);
  loading = signal(false);
  salvando = signal(false);
  editMode = signal(false);

  fieldTypes: FieldType[] = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'ENUM'];

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
          this.variaveisDisponiveis.set([...template.variaveisDisponiveis]);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar template:', err);
        this.loading.set(false);
      }
    });
  }

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

  adicionarVariavel() {
    this.variaveisDisponiveis.update(vars => [...vars, '']);
  }

  removerVariavel(index: number) {
    this.variaveisDisponiveis.update(vars => vars.filter((_, i) => i !== index));
  }

  atualizarVariavel(index: number, valor: string) {
    this.variaveisDisponiveis.update(vars =>
      vars.map((v, i) => i === index ? valor : v)
    );
  }

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

  onSubmit() {
    if (this.form.invalid) return;

    this.salvando.set(true);

    const dto: TemplateDocumentoCreate = {
      ...this.form.value,
      schemaItens: this.schemaFields().length > 0 ? { fields: this.schemaFields() } : null,
      variaveisDisponiveis: this.variaveisDisponiveis().filter(v => v.trim() !== '')
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

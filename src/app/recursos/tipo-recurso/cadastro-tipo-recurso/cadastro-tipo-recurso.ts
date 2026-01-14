import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { FieldDefinition, FieldType } from '../../../entities/field-schema.model';

interface FieldDefinitionForm {
  nome: FormControl<string>;
  rotulo: FormControl<string>;
  tipo: FormControl<FieldType>;
  obrigatorio: FormControl<boolean>;
  opcoes: FormControl<string>;
  tamanhoMaximo: FormControl<number | null>;
  regex: FormControl<string>;
  mensagemErro: FormControl<string>;
  valorMinimo: FormControl<number | null>;
  valorMaximo: FormControl<number | null>;
}

interface TipoRecursoForm {
  codigo: FormControl<string>;
  nome: FormControl<string>;
  descricao: FormControl<string>;
  ativo: FormControl<boolean>;
  fields: FormArray<FormGroup<FieldDefinitionForm>>;
}

@Component({
  selector: 'app-cadastro-tipo-recurso',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-tipo-recurso.html',
  styleUrl: './cadastro-tipo-recurso.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroTipoRecurso implements OnInit {
  tipoRecursoId = input<string | null>(null);
  editMode = signal(false);
  loading = signal(false);

  fieldTypes: FieldType[] = ['STRING', 'INTEGER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'ENUM'];

  form!: FormGroup<TipoRecursoForm>;

  constructor(
    private fb: FormBuilder,
    private tipoRecursoService: TipoRecursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      codigo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      descricao: new FormControl('', { nonNullable: true }),
      ativo: new FormControl(true, { nonNullable: true }),
      fields: this.fb.array<FormGroup<FieldDefinitionForm>>([])
    });

    if (this.tipoRecursoId()) {
      this.carregarTipoRecurso();
    }
  }

  get fields(): FormArray<FormGroup<FieldDefinitionForm>> {
    return this.form.controls.fields;
  }

  carregarTipoRecurso() {
    this.loading.set(true);
    this.tipoRecursoService.buscarPorId(Number(this.tipoRecursoId())).subscribe({
      next: (response) => {
        this.editMode.set(true);
        this.form.patchValue({
          codigo: response.codigo,
          nome: response.nome,
          descricao: response.descricao ?? '',
          ativo: response.ativo
        });

        // Carrega os campos do schema
        if (response.schema?.fields) {
          response.schema.fields.forEach(field => {
            this.addField(field);
          });
        }

        // Desabilita o código em modo edição
        this.form.controls.codigo.disable();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar tipo de recurso', error);
        this.loading.set(false);
      }
    });
  }

  createFieldGroup(field?: FieldDefinition): FormGroup<FieldDefinitionForm> {
    return this.fb.group({
      nome: new FormControl(field?.nome ?? '', { nonNullable: true, validators: [Validators.required] }),
      rotulo: new FormControl(field?.rotulo ?? '', { nonNullable: true, validators: [Validators.required] }),
      tipo: new FormControl<FieldType>(field?.tipo ?? 'STRING', { nonNullable: true }),
      obrigatorio: new FormControl(field?.obrigatorio ?? false, { nonNullable: true }),
      opcoes: new FormControl(field?.opcoes?.join(', ') ?? '', { nonNullable: true }),
      tamanhoMaximo: new FormControl<number | null>(field?.tamanhoMaximo ?? null),
      regex: new FormControl(field?.regex ?? '', { nonNullable: true }),
      mensagemErro: new FormControl(field?.mensagemErro ?? '', { nonNullable: true }),
      valorMinimo: new FormControl<number | null>(field?.valorMinimo ?? null),
      valorMaximo: new FormControl<number | null>(field?.valorMaximo ?? null)
    });
  }

  addField(field?: FieldDefinition) {
    this.fields.push(this.createFieldGroup(field));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  isEnumType(index: number): boolean {
    return this.fields.at(index).controls.tipo.value === 'ENUM';
  }

  isNumericType(index: number): boolean {
    const tipo = this.fields.at(index).controls.tipo.value;
    return tipo === 'INTEGER' || tipo === 'DECIMAL';
  }

  isStringType(index: number): boolean {
    return this.fields.at(index).controls.tipo.value === 'STRING';
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);

    const fieldsData: FieldDefinition[] = this.fields.controls.map(fg => {
      const fieldValue = fg.getRawValue();
      const field: FieldDefinition = {
        nome: fieldValue.nome,
        rotulo: fieldValue.rotulo,
        tipo: fieldValue.tipo,
        obrigatorio: fieldValue.obrigatorio
      };

      // Adiciona opções para ENUM
      if (fieldValue.tipo === 'ENUM' && fieldValue.opcoes) {
        field.opcoes = fieldValue.opcoes.split(',').map(o => o.trim()).filter(o => o);
      }

      // Adiciona validações de string
      if (fieldValue.tipo === 'STRING') {
        if (fieldValue.tamanhoMaximo) field.tamanhoMaximo = fieldValue.tamanhoMaximo;
        if (fieldValue.regex) field.regex = fieldValue.regex;
        if (fieldValue.mensagemErro) field.mensagemErro = fieldValue.mensagemErro;
      }

      // Adiciona validações numéricas
      if (fieldValue.tipo === 'INTEGER' || fieldValue.tipo === 'DECIMAL') {
        if (fieldValue.valorMinimo !== null) field.valorMinimo = fieldValue.valorMinimo;
        if (fieldValue.valorMaximo !== null) field.valorMaximo = fieldValue.valorMaximo;
      }

      return field;
    });

    const formValue = this.form.getRawValue();
    const schema = fieldsData.length > 0 ? { fields: fieldsData } : null;

    if (this.editMode()) {
      this.tipoRecursoService.atualizar(Number(this.tipoRecursoId()), {
        nome: formValue.nome,
        descricao: formValue.descricao || null,
        ativo: formValue.ativo,
        schema
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/tipos-recurso', this.tipoRecursoId(), 'detalhes']);
        },
        error: (error) => {
          console.error('Erro ao atualizar tipo de recurso', error);
          this.loading.set(false);
        }
      });
    } else {
      this.tipoRecursoService.criar({
        codigo: formValue.codigo,
        nome: formValue.nome,
        descricao: formValue.descricao || null,
        schema
      }).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.router.navigate(['/tipos-recurso', response.id, 'detalhes']);
        },
        error: (error) => {
          console.error('Erro ao criar tipo de recurso', error);
          this.loading.set(false);
        }
      });
    }
    console.log('Form Value:', this.form.value);
  }
}

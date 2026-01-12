import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemDinamicoService } from '../../../services/item-dinamico.service';
import { TipoRecursoService } from '../../../services/tipo-recurso.service';
import { TipoRecursoDTO } from '../../../entities/tipo-recurso.model';
import { FieldDefinition } from '../../../entities/field-schema.model';

@Component({
  selector: 'app-cadastro-item-dinamico',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-item-dinamico.html',
  styleUrl: './cadastro-item-dinamico.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroItemDinamico implements OnInit {
  itemId = input<string | null>(null);
  editMode = signal(false);
  loading = signal(false);

  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  tipoSelecionado = signal<TipoRecursoDTO | null>(null);
  camposDinamicos = signal<FieldDefinition[]>([]);

  form!: FormGroup;
  atributosForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemDinamicoService: ItemDinamicoService,
    private tipoRecursoService: TipoRecursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      tipoRecursoCodigo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      identificador: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      ativo: new FormControl(true, { nonNullable: true })
    });

    this.atributosForm = this.fb.group({});

    this.carregarTiposRecurso();

    if (this.itemId()) {
      this.carregarItem();
    }
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

  carregarItem() {
    this.loading.set(true);
    this.itemDinamicoService.buscarPorId(Number(this.itemId())).subscribe({
      next: (response) => {
        this.editMode.set(true);
        this.form.patchValue({
          tipoRecursoCodigo: response.tipoRecursoCodigo,
          identificador: response.identificador,
          ativo: response.ativo
        });

        // Desabilita a seleção de tipo em modo edição
        this.form.controls['tipoRecursoCodigo'].disable();

        // Carrega o tipo e seus campos
        const tipo = this.tiposRecurso().find(t => t.codigo === response.tipoRecursoCodigo);
        if (tipo) {
          this.onTipoChange(tipo.codigo, response.atributos);
        } else {
          // Carrega o tipo separadamente se ainda não estiver na lista
          this.tipoRecursoService.buscarPorCodigo(response.tipoRecursoCodigo).subscribe({
            next: (tipoResponse) => {
              this.onTipoChange(tipoResponse.codigo, response.atributos);
            }
          });
        }

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar item', error);
        this.loading.set(false);
      }
    });
  }

  onTipoChange(codigo: string, valoresIniciais?: Record<string, any>) {
    if (!codigo) {
      this.tipoSelecionado.set(null);
      this.camposDinamicos.set([]);
      this.atributosForm = this.fb.group({});
      return;
    }

    const tipo = this.tiposRecurso().find(t => t.codigo === codigo);
    if (tipo) {
      this.configurarCamposDinamicos(tipo, valoresIniciais);
    } else {
      this.tipoRecursoService.buscarPorCodigo(codigo).subscribe({
        next: (tipoResponse) => {
          this.configurarCamposDinamicos(tipoResponse, valoresIniciais);
        }
      });
    }
  }

  configurarCamposDinamicos(tipo: TipoRecursoDTO, valoresIniciais?: Record<string, any>) {
    this.tipoSelecionado.set(tipo);
    const campos = tipo.schema?.fields || [];
    this.camposDinamicos.set(campos);

    // Cria o FormGroup para os atributos dinâmicos
    const atributosControls: { [key: string]: FormControl } = {};
    campos.forEach(campo => {
      const valorInicial = valoresIniciais?.[campo.nome] ?? campo.valorPadrao ?? '';
      const validators = campo.obrigatorio ? [Validators.required] : [];
      atributosControls[campo.nome] = new FormControl(valorInicial, { validators });
    });

    this.atributosForm = this.fb.group(atributosControls);
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

  onSubmit() {
    if (this.form.invalid || this.atributosForm.invalid) {
      return;
    }

    this.loading.set(true);

    const formValue = this.form.getRawValue();
    const atributos = this.atributosForm.getRawValue();

    if (this.editMode()) {
      this.itemDinamicoService.atualizar(Number(this.itemId()), {
        identificador: formValue.identificador,
        atributos,
        ativo: formValue.ativo
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/itens', this.itemId(), 'detalhes']);
        },
        error: (error) => {
          console.error('Erro ao atualizar item', error);
          this.loading.set(false);
        }
      });
    } else {
      this.itemDinamicoService.criar({
        tipoRecursoCodigo: formValue.tipoRecursoCodigo,
        identificador: formValue.identificador,
        atributos
      }).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.router.navigate(['/itens', response.id, 'detalhes']);
        },
        error: (error) => {
          console.error('Erro ao criar item', error);
          this.loading.set(false);
        }
      });
    }
  }
}

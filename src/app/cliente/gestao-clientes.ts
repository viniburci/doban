import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../services/cliente.service';
import { ClienteDTO, ClienteCreateDTO } from '../entities/cliente.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-gestao-clientes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gestao-clientes.html',
  styleUrl: './gestao-clientes.css'
})
export class GestaoClientes implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private destroy$ = new Subject<void>();

  clientes = signal<ClienteDTO[]>([]);
  editMode = signal<boolean>(false);
  editingClienteId = signal<number | null>(null);
  showForm = signal<boolean>(false);
  loading = signal<boolean>(false);

  form!: FormGroup<{
    nome: FormControl<string | null>;
    descricao: FormControl<string | null>;
    ativo: FormControl<boolean | null>;
  }>;

  ngOnInit() {
    this.form = this.fb.group({
      nome: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
      descricao: new FormControl<string | null>(null),
      ativo: new FormControl<boolean | null>(true)
    });

    this.carregarClientes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarClientes() {
    this.loading.set(true);
    this.clienteService.listarTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes.set(clientes);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
          this.loading.set(false);
        }
      });
  }

  onNovoCliente() {
    this.editMode.set(false);
    this.editingClienteId.set(null);
    this.form.reset({ ativo: true });
    this.showForm.set(true);
  }

  onEditarCliente(cliente: ClienteDTO) {
    this.editMode.set(true);
    this.editingClienteId.set(cliente.id);
    this.form.patchValue({
      nome: cliente.nome,
      descricao: cliente.descricao,
      ativo: cliente.ativo
    });
    this.showForm.set(true);
  }

  onCancelar() {
    this.showForm.set(false);
    this.editMode.set(false);
    this.editingClienteId.set(null);
    this.form.reset({ ativo: true });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const clienteData: ClienteCreateDTO = {
      nome: this.form.value.nome!,
      descricao: this.form.value.descricao,
      ativo: this.form.value.ativo ?? true
    };

    const request$ = this.editMode()
      ? this.clienteService.atualizar(this.editingClienteId()!, clienteData)
      : this.clienteService.criar(clienteData);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.carregarClientes();
          this.onCancelar();
        },
        error: (error) => {
          console.error('Erro ao salvar cliente:', error);
        }
      });
  }

  onToggleAtivo(cliente: ClienteDTO) {
    this.clienteService.alternarAtivo(cliente.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.carregarClientes(),
        error: (error) => console.error('Erro ao alterar status:', error)
      });
  }

  onDeletar(cliente: ClienteDTO) {
    if (confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
      this.clienteService.deletar(cliente.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.carregarClientes(),
          error: (error) => console.error('Erro ao deletar cliente:', error)
        });
    }
  }
}

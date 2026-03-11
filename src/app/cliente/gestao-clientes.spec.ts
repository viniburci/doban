import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GestaoClientes } from './gestao-clientes';
import { ClienteService } from '../services/cliente.service';
import { NotificationService } from '../services/notification.service';
import { ClienteDTO } from '../entities/cliente.model';

const mockCliente: ClienteDTO = { id: 1, nome: 'Empresa Alpha', descricao: 'Desc', ativo: true };

describe('GestaoClientes', () => {
  let component: GestaoClientes;
  let fixture: ComponentFixture<GestaoClientes>;
  let clienteService: jasmine.SpyObj<ClienteService>;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const clienteSpy = jasmine.createSpyObj('ClienteService', [
      'listarTodos', 'criar', 'atualizar', 'deletar', 'alternarAtivo'
    ]);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    clienteSpy.listarTodos.and.returnValue(of([mockCliente]));

    await TestBed.configureTestingModule({
      imports: [GestaoClientes],
      providers: [
        { provide: ClienteService, useValue: clienteSpy },
        { provide: NotificationService, useValue: notifSpy },
      ]
    }).compileComponents();

    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;
    notifications = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture = TestBed.createComponent(GestaoClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes on init', () => {
    expect(clienteService.listarTodos).toHaveBeenCalled();
    expect(component.clientes().length).toBe(1);
  });

  it('should set loading to false after carregarClientes completes', () => {
    expect(component.loading()).toBeFalse();
  });

  describe('onNovoCliente', () => {
    it('should show form in create mode with reset values', () => {
      component.onNovoCliente();

      expect(component.showForm()).toBeTrue();
      expect(component.editMode()).toBeFalse();
      expect(component.editingClienteId()).toBeNull();
      expect(component.form.get('ativo')?.value).toBeTrue();
    });
  });

  describe('onEditarCliente', () => {
    it('should show form in edit mode with cliente data', () => {
      component.onEditarCliente(mockCliente);

      expect(component.showForm()).toBeTrue();
      expect(component.editMode()).toBeTrue();
      expect(component.editingClienteId()).toBe(1);
      expect(component.form.get('nome')?.value).toBe('Empresa Alpha');
    });
  });

  describe('onCancelar', () => {
    it('should hide form and reset state', () => {
      component.onEditarCliente(mockCliente);
      component.onCancelar();

      expect(component.showForm()).toBeFalse();
      expect(component.editMode()).toBeFalse();
      expect(component.editingClienteId()).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should do nothing when form is invalid', () => {
      component.form.reset();
      component.onSubmit();

      expect(clienteService.criar).not.toHaveBeenCalled();
      expect(clienteService.atualizar).not.toHaveBeenCalled();
    });

    it('should call criar in create mode', () => {
      clienteService.criar.and.returnValue(of({ id: 2, nome: 'Nova', ativo: true }));
      clienteService.listarTodos.and.returnValue(of([]));

      component.onNovoCliente();
      component.form.patchValue({ nome: 'Nova Empresa', ativo: true });
      component.onSubmit();

      expect(clienteService.criar).toHaveBeenCalled();
      expect(notifications.success).toHaveBeenCalledWith('Cliente criado com sucesso.');
    });

    it('should call atualizar in edit mode', () => {
      clienteService.atualizar.and.returnValue(of(mockCliente));
      clienteService.listarTodos.and.returnValue(of([]));

      component.onEditarCliente(mockCliente);
      component.onSubmit();

      expect(clienteService.atualizar).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(notifications.success).toHaveBeenCalledWith('Cliente atualizado com sucesso.');
    });
  });

  describe('onToggleAtivo', () => {
    it('should call alternarAtivo and reload', () => {
      clienteService.alternarAtivo.and.returnValue(of({ ...mockCliente, ativo: false }));
      clienteService.listarTodos.and.returnValue(of([]));

      component.onToggleAtivo(mockCliente);

      expect(clienteService.alternarAtivo).toHaveBeenCalledWith(1);
      expect(notifications.success).toHaveBeenCalledWith('Cliente desativado com sucesso.');
    });
  });

  describe('onDeletar', () => {
    it('should not delete when confirmed is false', () => {
      component.onDeletar(mockCliente, false);

      expect(clienteService.deletar).not.toHaveBeenCalled();
    });

    it('should call deletar when confirmed is true', () => {
      clienteService.deletar.and.returnValue(of(undefined));
      clienteService.listarTodos.and.returnValue(of([]));

      component.onDeletar(mockCliente, true);

      expect(clienteService.deletar).toHaveBeenCalledWith(1);
      expect(notifications.success).toHaveBeenCalledWith('Cliente removido com sucesso.');
    });
  });
});

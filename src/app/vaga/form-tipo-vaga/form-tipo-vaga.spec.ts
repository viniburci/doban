import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormTipoVaga } from './form-tipo-vaga';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { NotificationService } from '../../services/notification.service';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';

const mockTipoVaga: TipoVagaDTO = {
  id: 5, codigo: 'OP', nome: 'Operacional', descricao: 'Descricao', ativo: true,
  itensPadrao: [{ descricao: 'Item A', quantidade: 2 }]
};

describe('FormTipoVaga', () => {
  let fixture: ComponentFixture<FormTipoVaga>;
  let component: FormTipoVaga;
  let tipoVagaService: jasmine.SpyObj<TipoVagaService>;
  let notifications: jasmine.SpyObj<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    const tipoVagaSpy = jasmine.createSpyObj('TipoVagaService', ['buscarPorId', 'criar', 'atualizar']);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [FormTipoVaga],
      providers: [
        provideRouter([]),
        { provide: TipoVagaService, useValue: tipoVagaSpy },
        { provide: NotificationService, useValue: notifSpy },
      ]
    }).compileComponents();

    tipoVagaService = TestBed.inject(TipoVagaService) as jasmine.SpyObj<TipoVagaService>;
    notifications = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormTipoVaga);
    component = fixture.componentInstance;
    // detectChanges called per-test to allow setting inputs first
  });

  it('should create in create mode', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.editMode()).toBeFalse();
  });

  it('should initialize form with empty values', () => {
    fixture.detectChanges();
    expect(component.form.get('codigo')?.value).toBe('');
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.itensPadrao().length).toBe(0);
  });

  it('should have codigo as required with uppercase pattern', () => {
    fixture.detectChanges();
    const ctrl = component.form.get('codigo');

    ctrl?.setValue('');
    expect(ctrl?.invalid).toBeTrue();

    ctrl?.setValue('abc');
    expect(ctrl?.invalid).toBeTrue();

    ctrl?.setValue('ADM');
    expect(ctrl?.valid).toBeTrue();
  });

  it('should have nome as required with minLength 3', () => {
    fixture.detectChanges();
    const ctrl = component.form.get('nome');

    ctrl?.setValue('');
    expect(ctrl?.invalid).toBeTrue();

    ctrl?.setValue('Ab');
    expect(ctrl?.invalid).toBeTrue();

    ctrl?.setValue('Abc');
    expect(ctrl?.valid).toBeTrue();
  });

  describe('edit mode (tipoVagaId provided)', () => {
    beforeEach(() => {
      tipoVagaService.buscarPorId.and.returnValue(of(mockTipoVaga));
      tipoVagaService.atualizar.and.returnValue(of(mockTipoVaga));
      fixture.componentRef.setInput('tipoVagaId', '5');
      fixture.detectChanges();
    });

    it('should call buscarPorId and set editMode', () => {
      expect(tipoVagaService.buscarPorId).toHaveBeenCalledWith(5);
      expect(component.editMode()).toBeTrue();
    });

    it('should patch form with loaded data', () => {
      expect(component.form.get('codigo')?.value).toBe('OP');
      expect(component.form.get('nome')?.value).toBe('Operacional');
    });

    it('should load itensPadrao from tipo vaga', () => {
      expect(component.itensPadrao().length).toBe(1);
    });

    it('should call atualizar on submit and navigate', () => {
      spyOn(router, 'navigate');
      component.onSubmit();

      expect(tipoVagaService.atualizar).toHaveBeenCalledWith(5, jasmine.any(Object));
      expect(notifications.success).toHaveBeenCalledWith('Tipo de vaga atualizado com sucesso.');
      expect(router.navigate).toHaveBeenCalledWith(['/tipos-vaga']);
    });
  });

  describe('adicionarItemPadrao', () => {
    beforeEach(() => fixture.detectChanges());

    it('should add a new empty item with quantity 1', () => {
      component.adicionarItemPadrao();

      expect(component.itensPadrao().length).toBe(1);
      expect(component.itensPadrao()[0].descricao).toBe('');
      expect(component.itensPadrao()[0].quantidade).toBe(1);
    });
  });

  describe('removerItemPadrao', () => {
    beforeEach(() => fixture.detectChanges());

    it('should remove item at the given index', () => {
      component.adicionarItemPadrao();
      component.adicionarItemPadrao();
      component.removerItemPadrao(0);

      expect(component.itensPadrao().length).toBe(1);
    });
  });

  describe('atualizarItemPadrao', () => {
    beforeEach(() => fixture.detectChanges());

    it('should update the specified field of the item at index', () => {
      component.adicionarItemPadrao();
      component.atualizarItemPadrao(0, 'descricao', 'Capacete');

      expect(component.itensPadrao()[0].descricao).toBe('Capacete');
    });

    it('should not affect other items', () => {
      component.adicionarItemPadrao();
      component.adicionarItemPadrao();
      component.atualizarItemPadrao(0, 'descricao', 'Luva');

      expect(component.itensPadrao()[1].descricao).toBe('');
    });
  });

  describe('onSubmit (create mode)', () => {
    beforeEach(() => fixture.detectChanges());

    it('should do nothing when form is invalid', () => {
      component.form.reset();
      component.onSubmit();

      expect(tipoVagaService.criar).not.toHaveBeenCalled();
    });

    it('should call criar and navigate', () => {
      tipoVagaService.criar.and.returnValue(of(mockTipoVaga));
      spyOn(router, 'navigate');

      component.form.patchValue({ codigo: 'ADM', nome: 'Administrativo' });
      component.onSubmit();

      expect(tipoVagaService.criar).toHaveBeenCalled();
      expect(notifications.success).toHaveBeenCalledWith('Tipo de vaga criado com sucesso.');
      expect(router.navigate).toHaveBeenCalledWith(['/tipos-vaga']);
    });
  });
});

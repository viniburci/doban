import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GestaoTiposVaga } from './gestao-tipos-vaga';
import { TipoVagaService } from '../../services/tipo-vaga.service';
import { NotificationService } from '../../services/notification.service';
import { TipoVagaDTO } from '../../entities/tipo-vaga.model';

const mockTipoVaga: TipoVagaDTO = { id: 1, codigo: 'ADM', nome: 'Administrativo', ativo: true };

describe('GestaoTiposVaga', () => {
  let component: GestaoTiposVaga;
  let fixture: ComponentFixture<GestaoTiposVaga>;
  let tipoVagaService: jasmine.SpyObj<TipoVagaService>;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const tipoVagaSpy = jasmine.createSpyObj('TipoVagaService', ['listarTodos', 'desativar']);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    tipoVagaSpy.listarTodos.and.returnValue(of([mockTipoVaga]));

    await TestBed.configureTestingModule({
      imports: [GestaoTiposVaga],
      providers: [
        provideRouter([]),
        { provide: TipoVagaService, useValue: tipoVagaSpy },
        { provide: NotificationService, useValue: notifSpy },
      ]
    }).compileComponents();

    tipoVagaService = TestBed.inject(TipoVagaService) as jasmine.SpyObj<TipoVagaService>;
    notifications = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    fixture = TestBed.createComponent(GestaoTiposVaga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call carregarTiposVaga on init', () => {
    expect(tipoVagaService.listarTodos).toHaveBeenCalled();
    expect(component.tiposVaga().length).toBe(1);
  });

  it('should set loading to false after loading completes', () => {
    expect(component.loading()).toBeFalse();
  });

  describe('desativarTipoVaga', () => {
    it('should do nothing when confirmed is false', () => {
      component.desativarTipoVaga(mockTipoVaga, false);

      expect(tipoVagaService.desativar).not.toHaveBeenCalled();
    });

    it('should do nothing when tipo has no id', () => {
      const semId: TipoVagaDTO = { ...mockTipoVaga, id: null };
      component.desativarTipoVaga(semId, true);

      expect(tipoVagaService.desativar).not.toHaveBeenCalled();
    });

    it('should call desativar and reload when confirmed with valid id', () => {
      tipoVagaService.desativar.and.returnValue(of(undefined));
      tipoVagaService.listarTodos.and.returnValue(of([]));

      component.desativarTipoVaga(mockTipoVaga, true);

      expect(tipoVagaService.desativar).toHaveBeenCalledWith(1);
      expect(notifications.success).toHaveBeenCalledWith('Tipo de vaga desativado com sucesso.');
    });
  });
});

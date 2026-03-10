import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CadastroPessoa } from './cadastro-pessoa';
import { PessoaService } from '../../services/pessoa-service';
import { DataService } from '../../services/data-service';
import { NotificationService } from '../../services/notification.service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { provideNgxMask } from 'ngx-mask';

const mockPessoa: PessoaFormData = {
  id: '1', nome: 'Alice', email: 'alice@test.com', telefone: null,
  dataNascimento: '1990-05-20', endereco: null, complemento: null,
  bairro: null, cidade: null, estado: null, cep: null,
  numeroCtps: null, serieCtps: null, dataEmissaoCtps: null,
  numeroRg: null, dataEmissaoRg: null, ufRg: null,
  cpf: null, pis: null, dataEmissaoPis: null, tituloEleitor: null,
  localNascimento: null, mae: null, pai: null, estadoCivil: null,
  categoriaCnh: null, numeroCnh: null, registroCnh: null, validadeCnh: null,
  chavePix: null, ativo: true,
  tamanhoCamisa: null, tamanhoCalca: null, tamanhoCalcado: null,
  tamanhoLuva: null, tamanhoCapacete: null,
};

describe('CadastroPessoa', () => {
  let fixture: ComponentFixture<CadastroPessoa>;
  let component: CadastroPessoa;
  let pessoaService: jasmine.SpyObj<PessoaService>;
  let notifications: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const pessoaSpy = jasmine.createSpyObj('PessoaService', ['buscarPessoa', 'criarPessoa', 'atualizarPessoa']);
    const dataSpy = jasmine.createSpyObj('DataService', ['convertISOToDateBR', 'convertDateToISO']);
    const notifSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    dataSpy.convertISOToDateBR.and.returnValue('20/05/1990');
    dataSpy.convertDateToISO.and.returnValue('1990-05-20');

    await TestBed.configureTestingModule({
      imports: [CadastroPessoa],
      providers: [
        provideNgxMask(),
        { provide: PessoaService, useValue: pessoaSpy },
        { provide: DataService, useValue: dataSpy },
        { provide: NotificationService, useValue: notifSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    pessoaService = TestBed.inject(PessoaService) as jasmine.SpyObj<PessoaService>;
    notifications = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(CadastroPessoa);
    component = fixture.componentInstance;
    // detectChanges is called in each test to allow setting inputs first
  });

  it('should create in create mode', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.editMode()).toBeFalse();
  });

  it('should initialize form with empty controls', () => {
    fixture.detectChanges();
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should load pessoa and set editMode when pessoaId is provided', () => {
    pessoaService.buscarPessoa.and.returnValue(of(mockPessoa));
    fixture.componentRef.setInput('pessoaId', '1');
    fixture.detectChanges();

    expect(pessoaService.buscarPessoa).toHaveBeenCalledWith(1);
    expect(component.editMode()).toBeTrue();
  });

  describe('emptyStringsToNull', () => {
    beforeEach(() => fixture.detectChanges());

    it('should convert whitespace-only string to null', () => {
      const result = component.emptyStringsToNull({ ...mockPessoa, nome: '   ' });
      expect(result.nome).toBeNull();
    });

    it('should leave non-empty strings unchanged', () => {
      expect(component.emptyStringsToNull(mockPessoa).nome).toBe('Alice');
    });

    it('should leave boolean values unchanged', () => {
      expect(component.emptyStringsToNull(mockPessoa).ativo).toBeTrue();
    });
  });

  describe('onSubmit (create mode)', () => {
    beforeEach(() => fixture.detectChanges());

    it('should call criarPessoa and navigate on success', () => {
      pessoaService.criarPessoa.and.returnValue(of({ ...mockPessoa, id: '99' }));
      component.form.patchValue({ nome: 'Novo' });

      component.onSubmit();

      expect(pessoaService.criarPessoa).toHaveBeenCalled();
      expect(notifications.success).toHaveBeenCalledWith('Pessoa cadastrada com sucesso.');
      expect(router.navigate).toHaveBeenCalledWith(['/pessoas', '99', 'detalhes']);
    });
  });

  describe('onSubmit (edit mode)', () => {
    beforeEach(() => {
      pessoaService.buscarPessoa.and.returnValue(of(mockPessoa));
      pessoaService.atualizarPessoa.and.returnValue(of(mockPessoa));
      fixture.componentRef.setInput('pessoaId', '1');
      fixture.detectChanges();
    });

    it('should call atualizarPessoa and navigate on success', () => {
      component.onSubmit();

      expect(pessoaService.atualizarPessoa).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(notifications.success).toHaveBeenCalledWith('Pessoa atualizada com sucesso.');
      expect(router.navigate).toHaveBeenCalledWith(['/pessoas', '1', 'detalhes']);
    });
  });
});

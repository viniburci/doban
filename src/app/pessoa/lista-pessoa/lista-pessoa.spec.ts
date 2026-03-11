import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ListaPessoa } from './lista-pessoa';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';

function mockPessoa(id: string, nome: string): PessoaFormData {
  return {
    id,
    nome,
    email: null,
    telefone: null,
    dataNascimento: null,
    endereco: null,
    complemento: null,
    bairro: null,
    cidade: null,
    estado: null,
    cep: null,
    numeroCtps: null,
    serieCtps: null,
    dataEmissaoCtps: null,
    numeroRg: null,
    dataEmissaoRg: null,
    ufRg: null,
    cpf: null,
    pis: null,
    dataEmissaoPis: null,
    tituloEleitor: null,
    localNascimento: null,
    mae: null,
    pai: null,
    estadoCivil: null,
    categoriaCnh: null,
    numeroCnh: null,
    registroCnh: null,
    validadeCnh: null,
    chavePix: null,
    ativo: true,
    tamanhoCamisa: null,
    tamanhoCalca: null,
    tamanhoCalcado: null,
    tamanhoLuva: null,
    tamanhoCapacete: null,
  };
}

describe('ListaPessoa', () => {
  let component: ListaPessoa;
  let fixture: ComponentFixture<ListaPessoa>;
  let pessoaService: jasmine.SpyObj<PessoaService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const pessoaSpy = jasmine.createSpyObj('PessoaService', [
      'buscarPessoasAtivas',
      'buscarPessoasInativas'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    pessoaSpy.buscarPessoasAtivas.and.returnValue(of([]));
    pessoaSpy.buscarPessoasInativas.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ListaPessoa],
      providers: [
        { provide: PessoaService, useValue: pessoaSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    pessoaService = TestBed.inject(PessoaService) as jasmine.SpyObj<PessoaService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ListaPessoa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call buscarPessoasAtivas and buscarPessoasInativas on init', () => {
    expect(pessoaService.buscarPessoasAtivas).toHaveBeenCalled();
    expect(pessoaService.buscarPessoasInativas).toHaveBeenCalled();
  });

  it('should set carregando to false after both requests complete', () => {
    expect(component.carregando()).toBeFalse();
  });

  it('should start with empty pessoa lists', () => {
    expect(component.pessoasAtivas()).toEqual([]);
    expect(component.pessoasInativas()).toEqual([]);
  });

  it('should populate pessoasAtivas when service returns data', () => {
    const pessoas = [mockPessoa('1', 'Alice'), mockPessoa('2', 'Bob')];
    pessoaService.buscarPessoasAtivas.and.returnValue(of(pessoas));

    component.carregarPessoas();

    expect(component.pessoasAtivas().length).toBe(2);
  });

  it('should reset page to 0 when reloading', () => {
    component.paginaAtivas.set(2);
    pessoaService.buscarPessoasAtivas.and.returnValue(of([]));

    component.carregarPessoas();

    expect(component.paginaAtivas()).toBe(0);
  });

  describe('navegarParaDetalhes', () => {
    it('should navigate to details page when pessoaId is provided', () => {
      component.navegarParaDetalhes('42');

      expect(router.navigate).toHaveBeenCalledWith(['/pessoas', '42', 'detalhes']);
    });

    it('should not navigate when pessoaId is null', () => {
      component.navegarParaDetalhes(null);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navegarParaRegistro', () => {
    it('should navigate to the new person form', () => {
      component.navegarParaRegistro();

      expect(router.navigate).toHaveBeenCalledWith(['/pessoas/novo']);
    });
  });

  describe('range()', () => {
    it('should return an array of indices from 0 to n-1', () => {
      expect(component.range(3)).toEqual([0, 1, 2]);
    });

    it('should return an empty array for 0', () => {
      expect(component.range(0)).toEqual([]);
    });

    it('should return a single element array for 1', () => {
      expect(component.range(1)).toEqual([0]);
    });
  });

  describe('pagination (ativos)', () => {
    const TOTAL = 25;

    beforeEach(() => {
      const pessoas = Array.from({ length: TOTAL }, (_, i) =>
        mockPessoa(String(i + 1), `Pessoa ${i + 1}`)
      );
      component.pessoasAtivas.set(pessoas);
    });

    it('should compute 3 total pages for 25 items', () => {
      expect(component.totalPaginasAtivas()).toBe(3);
    });

    it('should show 10 items on first page', () => {
      component.paginaAtivas.set(0);
      expect(component.pessoasAtivasPaginadas().length).toBe(10);
    });

    it('should show 10 items on second page', () => {
      component.paginaAtivas.set(1);
      expect(component.pessoasAtivasPaginadas().length).toBe(10);
    });

    it('should show remaining 5 items on last page', () => {
      component.paginaAtivas.set(2);
      expect(component.pessoasAtivasPaginadas().length).toBe(5);
    });

    it('should update current page with navegarPaginaAtivas()', () => {
      component.navegarPaginaAtivas(2);
      expect(component.paginaAtivas()).toBe(2);
    });
  });

  describe('pagination (inativos)', () => {
    beforeEach(() => {
      const pessoas = Array.from({ length: 15 }, (_, i) =>
        mockPessoa(String(i + 1), `Inativo ${i + 1}`)
      );
      component.pessoasInativas.set(pessoas);
    });

    it('should compute 2 total pages for 15 items', () => {
      expect(component.totalPaginasInativas()).toBe(2);
    });

    it('should show 5 items on second page', () => {
      component.paginaInativas.set(1);
      expect(component.pessoasInativasPaginadas().length).toBe(5);
    });

    it('should update current page with navegarPaginaInativas()', () => {
      component.navegarPaginaInativas(1);
      expect(component.paginaInativas()).toBe(1);
    });
  });
});

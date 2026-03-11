import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { ClienteCreateDTO } from '../entities/cliente.model';
import { environment } from '../../environments/environment';

describe('ClienteService', () => {
  let service: ClienteService;
  let http: HttpTestingController;
  const BASE = `${environment.apiUrl}/api/v1/clientes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClienteService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClienteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listarTodos should GET /clientes', () => {
    service.listarTodos().subscribe();
    http.expectOne({ url: BASE, method: 'GET' }).flush([]);
  });

  it('listarAtivos should GET /clientes/ativos', () => {
    service.listarAtivos().subscribe();
    http.expectOne({ url: `${BASE}/ativos`, method: 'GET' }).flush([]);
  });

  it('buscarPorId should GET /clientes/:id', () => {
    service.buscarPorId(10).subscribe();
    http.expectOne({ url: `${BASE}/10`, method: 'GET' }).flush({});
  });

  it('criar should POST /clientes with payload', () => {
    const dto: ClienteCreateDTO = { nome: 'Empresa X', ativo: true };
    service.criar(dto).subscribe();
    const req = http.expectOne({ url: BASE, method: 'POST' });
    expect(req.request.body).toEqual(dto);
    req.flush({ id: 1, ...dto });
  });

  it('atualizar should PUT /clientes/:id with payload', () => {
    const dto: ClienteCreateDTO = { nome: 'Empresa Y', ativo: false };
    service.atualizar(5, dto).subscribe();
    const req = http.expectOne({ url: `${BASE}/5`, method: 'PUT' });
    expect(req.request.body).toEqual(dto);
    req.flush({ id: 5, ...dto });
  });

  it('deletar should DELETE /clientes/:id', () => {
    service.deletar(2).subscribe();
    http.expectOne({ url: `${BASE}/2`, method: 'DELETE' }).flush(null);
  });

  it('alternarAtivo should PATCH /clientes/:id/toggle-ativo', () => {
    service.alternarAtivo(3).subscribe();
    const req = http.expectOne({ url: `${BASE}/3/toggle-ativo`, method: 'PATCH' });
    req.flush({});
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PessoaService } from './pessoa-service';
import { environment } from '../../environments/environment';

describe('PessoaService', () => {
  let service: PessoaService;
  let http: HttpTestingController;
  const BASE = `${environment.apiUrl}/api/v1/pessoa`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PessoaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PessoaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('buscarTodasPessoas should GET /pessoa', () => {
    service.buscarTodasPessoas().subscribe();
    http.expectOne({ url: BASE, method: 'GET' }).flush([]);
  });

  it('buscarPessoasAtivas should GET /pessoa/ativas', () => {
    service.buscarPessoasAtivas().subscribe();
    http.expectOne({ url: `${BASE}/ativas`, method: 'GET' }).flush([]);
  });

  it('buscarPessoasInativas should GET /pessoa/inativas', () => {
    service.buscarPessoasInativas().subscribe();
    http.expectOne({ url: `${BASE}/inativas`, method: 'GET' }).flush([]);
  });

  it('buscarPessoa should GET /pessoa/:id', () => {
    service.buscarPessoa(42).subscribe();
    http.expectOne({ url: `${BASE}/42`, method: 'GET' }).flush({});
  });

  it('criarPessoa should POST /pessoa with the payload', () => {
    const payload = { nome: 'Alice' } as any;
    service.criarPessoa(payload).subscribe();
    const req = http.expectOne({ url: BASE, method: 'POST' });
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('atualizarPessoa should PUT /pessoa/atualizar/:id', () => {
    const payload = { nome: 'Bob' } as any;
    service.atualizarPessoa(7, payload).subscribe();
    const req = http.expectOne({ url: `${BASE}/atualizar/7`, method: 'PUT' });
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('deletarPessoa should DELETE /pessoa/:id', () => {
    service.deletarPessoa(3).subscribe();
    http.expectOne({ url: `${BASE}/3`, method: 'DELETE' }).flush(null);
  });

  it('uploadFoto should POST /pessoa/:id/foto with FormData', () => {
    const file = new File(['content'], 'foto.jpg', { type: 'image/jpeg' });
    service.uploadFoto(1, file).subscribe();
    const req = http.expectOne({ url: `${BASE}/1/foto`, method: 'POST' });
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush('url-da-foto');
  });

  it('buscarFoto should GET /pessoa/:id/foto as blob', () => {
    service.buscarFoto(5).subscribe();
    const req = http.expectOne({ url: `${BASE}/5/foto`, method: 'GET' });
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessage } from './auth.interceptor';

describe('extractErrorMessage', () => {
  const makeError = (status: number, error?: unknown): HttpErrorResponse =>
    new HttpErrorResponse({ status, error, url: '/api/test' });

  it('should return error.error.message when present', () => {
    const err = makeError(400, { message: 'Mensagem customizada' });
    expect(extractErrorMessage(err)).toBe('Mensagem customizada');
  });

  it('should return error.error when it is a plain string', () => {
    const err = makeError(400, 'Erro em texto puro');
    expect(extractErrorMessage(err)).toBe('Erro em texto puro');
  });

  it('should return connection error message for status 0', () => {
    expect(extractErrorMessage(makeError(0))).toBe('Servidor indisponivel. Verifique sua conexao.');
  });

  it('should return bad request message for status 400', () => {
    expect(extractErrorMessage(makeError(400))).toBe('Requisicao invalida.');
  });

  it('should return session expired message for status 401', () => {
    expect(extractErrorMessage(makeError(401))).toBe('Sessao expirada. Faca login novamente.');
  });

  it('should return access denied message for status 403', () => {
    expect(extractErrorMessage(makeError(403))).toBe('Acesso negado.');
  });

  it('should return not found message for status 404', () => {
    expect(extractErrorMessage(makeError(404))).toBe('Recurso nao encontrado.');
  });

  it('should return server error message for status 500', () => {
    expect(extractErrorMessage(makeError(500))).toBe('Erro interno do servidor.');
  });

  it('should return error.message for unknown status codes', () => {
    const err = new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable', url: '/api/test' });
    expect(extractErrorMessage(err)).toBeTruthy();
  });
});

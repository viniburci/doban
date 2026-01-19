import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoDocumento {
  id: string;
  nome: string;
  selecionado: boolean;
}

export const TIPOS_DOCUMENTOS: TipoDocumento[] = [
  { id: 'contrato', nome: 'Contrato de Trabalho', selecionado: false },
  { id: 'vt', nome: 'Vale Transporte', selecionado: false },
  { id: 'contrato_ps', nome: 'Contrato Prestacao de Servicos', selecionado: false },
  { id: 'termo_materiais', nome: 'Termo de Materiais', selecionado: false },
  { id: 'entrega_epi', nome: 'Entrega de EPI', selecionado: false },
  { id: 'recibo_pagamento', nome: 'Recibo de Pagamento', selecionado: false }
];

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/documentos';

  gerarDocumento(vagaId: number, tipo: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${tipo}/${vagaId}`, {
      responseType: 'blob'
    });
  }

  gerarDocumentosCombinados(vagaId: number, tipos: string[]): Observable<Blob> {
    const params = new HttpParams().set('tipos', tipos.join(','));
    return this.http.get(`${this.apiUrl}/documentos_combinados/${vagaId}`, {
      params,
      responseType: 'blob'
    });
  }
}

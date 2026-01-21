import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DadosTemplate,
  GerarDocumentoRequest,
  GerarDocumentoCustomRequest
} from '../entities/template-documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoDinamicoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/documentos-dinamicos';

  obterDadosTemplate(templateCodigo: string, vagaId: number): Observable<DadosTemplate> {
    return this.http.get<DadosTemplate>(`${this.apiUrl}/dados/${templateCodigo}/${vagaId}`);
  }

  gerarDocumento(templateCodigo: string, vagaId: number, dados?: GerarDocumentoRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar/${templateCodigo}/${vagaId}`, dados ?? {}, {
      responseType: 'blob'
    });
  }

  previewDocumento(templateCodigo: string, vagaId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/preview/${templateCodigo}/${vagaId}`, {
      responseType: 'text'
    });
  }

  gerarDocumentoCustom(vagaId: number, request: GerarDocumentoCustomRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar-custom/${vagaId}`, request, {
      responseType: 'blob'
    });
  }
}

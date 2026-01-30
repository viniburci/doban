import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoDocumento {
  id: string;
  nome: string;
  descricao: string;
  selecionado: boolean;
}

// Documentos baseados em VAGA (usam vagaId)
export const TIPOS_DOCUMENTOS_VAGA: TipoDocumento[] = [
  { id: 'contrato', nome: 'Contrato de Trabalho', descricao: 'Contrato CLT padrao', selecionado: false },
  { id: 'contrato_ps', nome: 'Contrato PS', descricao: 'Contrato de prestacao de servicos', selecionado: false },
  { id: 'vt', nome: 'Vale Transporte', descricao: 'Declaracao de vale transporte', selecionado: false },
  { id: 'entrega_epi', nome: 'Entrega EPI', descricao: 'Registro simples de entrega', selecionado: false },
  { id: 'registro_entrega_epi', nome: 'Registro Entrega EPI', descricao: 'Registro completo com obrigacoes', selecionado: false },
  { id: 'termo_recebimento_epi', nome: 'Termo Recebimento EPI', descricao: 'Termo com valores dos itens', selecionado: false },
  { id: 'termo_devolucao_epi', nome: 'Termo Devolucao EPI', descricao: 'Para devolucao de uniformes/EPI', selecionado: false },
  { id: 'recibo_pagamento', nome: 'Recibo de Pagamento', descricao: 'Recibo mensal', selecionado: false },
  { id: 'cracha', nome: 'Cracha', descricao: 'Cracha do colaborador', selecionado: false },
];

// Documentos baseados em PESSOA + ITENS (usam pessoaId e itemIds)
export const TIPOS_DOCUMENTOS_PESSOA_ITENS: TipoDocumento[] = [
  { id: 'termo_responsabilidade_materiais', nome: 'Termo Responsabilidade Materiais', descricao: 'Para emprestimo de celular/equipamentos', selecionado: false },
  { id: 'declaracao_devolucao_aparelho', nome: 'Declaracao Devolucao Aparelho', descricao: 'Para devolucao de aparelho corporativo', selecionado: false },
];

// Alias para manter compatibilidade
export const TIPOS_DOCUMENTOS = TIPOS_DOCUMENTOS_VAGA;

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/documentos';

  // Documentos baseados em VAGA
  gerarDocumento(vagaId: number, tipo: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${tipo}/${vagaId}`, {
      responseType: 'blob'
    });
  }

  gerarDocumentosCombinados(vagaId: number, tipos: string[]): Observable<Blob> {
    let params = new HttpParams();
    tipos.forEach(tipo => {
      params = params.append('tipos', tipo);
    });
    return this.http.get(`${this.apiUrl}/documentos_combinados/${vagaId}`, {
      params,
      responseType: 'blob'
    });
  }

  // Documentos baseados em PESSOA + ITENS
  gerarTermoResponsabilidadeMateriais(pessoaId: number, itemIds: number[]): Observable<Blob> {
    let params = new HttpParams();
    itemIds.forEach(id => {
      params = params.append('itemIds', id.toString());
    });
    return this.http.get(`${this.apiUrl}/termo_responsabilidade_materiais/${pessoaId}`, {
      params,
      responseType: 'blob'
    });
  }

  gerarDeclaracaoDevolucaoAparelho(pessoaId: number, itemIds: number[]): Observable<Blob> {
    let params = new HttpParams();
    itemIds.forEach(id => {
      params = params.append('itemIds', id.toString());
    });
    return this.http.get(`${this.apiUrl}/declaracao_devolucao_aparelho/${pessoaId}`, {
      params,
      responseType: 'blob'
    });
  }

  // Documento baseado apenas em PESSOA
  gerarTermoDevolucao(pessoaId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/termo_devolucao/${pessoaId}`, {
      responseType: 'blob'
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

import { Observable, map } from 'rxjs';


export interface MensagemPadrao {
  idMensagem: number;
  nome: string;
  mensagem: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ApiListaResponse<T> {
  sucesso: boolean;
  total: number;
  pagina: number;
  limite: number;
  dados: T[];
}

export interface ApiItemResponse<T> {
  sucesso: boolean;
  dados: T | null;
}

@Injectable({ providedIn: 'root' })
export class MensagensPadraoService {
  private baseUrl = `${environment.apiURL}/mensagens-padrao`;

  constructor(private http: HttpClient) {}

  listar(pagina = 1, limite = 20): Observable<{ itens: MensagemPadrao[]; total: number; pagina: number; limite: number }> {
    return this.http.get<ApiListaResponse<MensagemPadrao>>(
      `${this.baseUrl}/`,
      { params: { pagina: String(pagina), limite: String(limite) } }
    ).pipe(
      map(res => ({
        itens: Array.isArray(res?.dados) ? res.dados : [],
        total: Number(res?.total ?? (res?.dados?.length ?? 0)),
        pagina: Number(res?.pagina ?? pagina),
        limite: Number(res?.limite ?? limite)
      }))
    );
  }

  criar(payload: Pick<MensagemPadrao, 'nome' | 'mensagem'>) {
    return this.http.post<MensagemPadrao | ApiItemResponse<MensagemPadrao>>(`${this.baseUrl}/`, payload)
      .pipe(map((res: any) => (res?.dados ? res.dados : res)));
  }

  obter(idMensagem: number) {
    return this.http.get<MensagemPadrao | ApiItemResponse<MensagemPadrao>>(`${this.baseUrl}/${idMensagem}`)
      .pipe(map((res: any) => (res?.dados ? res.dados : res)));
  }

  atualizar(idMensagem: number, payload: Partial<Pick<MensagemPadrao,'nome'|'mensagem'>>) {
    return this.http.put<MensagemPadrao | ApiItemResponse<MensagemPadrao>>(`${this.baseUrl}/${idMensagem}`, payload)
      .pipe(map((res: any) => (res?.dados ? res.dados : res)));
  }

  deletar(idMensagem: number) {
    return this.http.delete<void | ApiItemResponse<unknown>>(`${this.baseUrl}/${idMensagem}`)
      .pipe(map(() => void 0));
  }
}

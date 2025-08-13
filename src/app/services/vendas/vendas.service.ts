import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';

export interface PaginationMeta {
  total: number; page: number; perPage: number; totalPages: number;
}
type ApiResponse<T> = { success: boolean; data: T };
export type PaginatedResponse<T> = { success: boolean; meta: PaginationMeta; data: T[] };

export type PeriodoPayload = 'hoje' | 'semana' | 'mes' | [string, string];

export type ClienteItem = {
  nome: string;
  updatedAt: string;
  status: string | null;
  observacao: string | null;
};

export type EventoItem = {
  data: string;
  evento: string | null;
  confirmado: boolean;
  usuario?: { nomeCompleto: string | null } | null;
  cliente: { nome: string | null } | null;
};

@Injectable({ providedIn: 'root' })
export class VendasService {
  private base = `${environment.apiURL}/clientes/dashboard`;

  constructor(private http: HttpClient) {}

  // mantém o componente recebendo IDashboardVendas direto
  getAtendimento(periodo: PeriodoPayload): Observable<IDashboardVendas> {
    return this.http
      .post<ApiResponse<IDashboardVendas>>(`${this.base}`, { periodo })
      .pipe(map(r => r.data));
  }

  // Listas paginadas (mantém { success, meta, data } porque o componente usa res.data e res.meta)
  getClientesNovosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/novos`, { periodo, page, perPage }
    );
  }

  getClientesAtendidosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/atendidos`, { periodo, page, perPage }
    );
  }

  getClientesFechadosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/fechados`, { periodo, page, perPage }
    );
  }

  getEventosMarcadosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<EventoItem>>(
      `${this.base}/eventos`, { periodo, page, perPage }
    );
  }

  // (os métodos que você já tinha)
  public getContatos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/vendas`);
  }

  public marcarContato(dados: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiURL}/automacao/marcarContato`, dados);
  }
}

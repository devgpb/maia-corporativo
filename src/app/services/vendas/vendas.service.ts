import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
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

export type EventoUsuarioDTO = {
  idEvento: number;
  idUsuario?: number;
  idCliente?: number;
  data: string;               // UTC ISO
  dataLocal?: string;
  evento?: string | null;
  confirmado?: boolean | null;
  cliente?: { nome?: string | null } | null;
};

export type LigacaoItem = {
  idLigacao: number;
  data: string;        // DATEONLY (YYYY-MM-DD)
  createdAt: string;   // ISO
  atendido: boolean;
  observacao?: string | null;
  autor?: { idUsuario: number; nomeCompleto: string } | null;
  cliente?: { idCliente: number; nome: string; celular: string } | null;
};

@Injectable({ providedIn: 'root' })
export class VendasService {
  private base = `${environment.apiURL}/clientes/dashboard`;

  constructor(private http: HttpClient) { }

  // mantém o componente recebendo IDashboardVendas direto
  getAtendimento(periodo: PeriodoPayload): Observable<IDashboardVendas> {
    return this.http
      .post<ApiResponse<IDashboardVendas>>(`${this.base}`, { periodo })
      .pipe(map(r => r.data));
  }

  // Listas paginadas (mantém { success, meta, data } porque o componente usa res.data e res.meta)
  getClientesNovosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/clientes-novos`, { periodo, page, perPage }
    );
  }

  getClientesAtendidosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/clientes-atendidos`, { periodo, page, perPage }
    );
  }

  getClientesFechadosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<ClienteItem>>(
      `${this.base}/clientes-fechados`, { periodo, page, perPage }
    );
  }

  getEventosMarcadosList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<EventoItem>>(
      `${this.base}/eventos-marcados`, { periodo, page, perPage }
    );
  }

  getLigacoesList(periodo: PeriodoPayload, page: number, perPage: number) {
    return this.http.post<PaginatedResponse<LigacaoItem>>(
      `${this.base}/ligacoes`, { periodo, page, perPage }
    );
  }

  // (os métodos que você já tinha)
  public getContatos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/vendas`);
  }

  public marcarContato(dados: any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiURL}/automacao/marcarContato`, dados);
  }

  // === Eventos ===
  confirmarEvento(idEvento: any){
    return this.http.post<any[]>(`${environment.apiURL}/clientes/eventos/${idEvento}/confirmar`,{});
  }

  cancelarEvento(idEvento: any){
    return this.http.post<any[]>(`${environment.apiURL}/clientes/eventos/${idEvento}/cancelar`,{});
  }

  /** GET /eventos?idUsuario=123[&hoje=true][&tz=America/Maceio][&confirmados=true|false] */
  getEventosUsuario(
    idUsuario: number,
    opts: { hoje?: boolean; tz?: string; confirmados?: boolean } = {}
  ): Observable<(EventoUsuarioDTO)[]> {
    const params: any = {
      idUsuario,
      ...(opts.hoje !== undefined ? { hoje: String(!!opts.hoje) } : {}),
      ...(opts.tz ? { tz: opts.tz } : {}),
      ...(opts.confirmados !== undefined ? { confirmados: String(!!opts.confirmados) } : {}),
    };
    return this.http.get<(EventoUsuarioDTO)[]>(
      `${environment.apiURL}/clientes/eventos`,
      { params }
    );
  }

  /** GET /eventos/intervalo?inicio=YYYY-MM-DD[THH:mm]&fim=YYYY-MM-DD[THH:mm][&tz=America/Maceio] */
  getEventosIntervalo(
    inicio: string,
    fim: string,
    tz = 'America/Maceio'
  ): Observable<(EventoItem & { dataISO?: string; dataLocal?: string })[]> {
    return this.http.get<(EventoItem & { dataISO?: string; dataLocal?: string })[]>(
      `${environment.apiURL}/eventos/intervalo`,
      { params: { inicio, fim, tz } }
    );
  }



}

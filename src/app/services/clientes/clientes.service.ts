import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';
import { INovoPedido } from 'src/app/interfaces/INovoPedido';
import { IConfigExcel } from 'src/app/interfaces/IConfigExcel';
import { Cliente } from 'src/app/interfaces/ICliente';

export type EventoClienteDTO = {
  idEvento: number;
  idCliente: number;
  data: string;                // UTC ISO vindo da API
  evento?: string | null;
  confirmado?: boolean | null;
  dataISO?: string;            // opcional (se API devolver)
  dataLocal?: string;          // opcional (se API devolver)
};

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  public listaDeCampanhas = [
    "Sem Campanha",
    "Campanha de Rua",
    "Feirão",
    "Promoção do Mês"
  ]

  public postCliente(cliente){
    return this.http.post(`${environment.apiURL}/clientes`, cliente);
  }

  getClientes(filtros?: any) {
    let params = '';
    if (filtros) {
      params = '?' + Object.entries(filtros)
        .filter(([_, v]) => String(v) && String(v) !== 'todos' && String(v) !== 'todas')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
    }
    return this.http.get<Cliente[]>(`${environment.apiURL}/clientes${params}`);
  }

  getFiltrosClientes() {
  return this.http.get<{status: string[], cidades: string[]}>(`${environment.apiURL}/clientes/filtros`);
  }

  public deleteClientes(id: number): Observable<any> {
    return this.http.delete(`${environment.apiURL}/clientes/${id}`);
  }

  /** GET /eventos/:id[?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&tz=America/Maceio]  (id = idCliente) */
  getEventosDoCliente(
    idCliente: number,
    opts: { inicio?: string; fim?: string; tz?: string } = {}
  ): Observable<EventoClienteDTO[]> {
    let params = new HttpParams();
    params = params.append('idCliente', idCliente)
    if (opts.inicio) params = params.set('inicio', opts.inicio);
    if (opts.fim)    params = params.set('fim', opts.fim);
    if (opts.tz)     params = params.set('tz', opts.tz);

    return this.http.get<EventoClienteDTO[]>(`${environment.apiURL}/clientes/eventos/lista/cliente/`, { params });
  }

  /** POST /eventos  (criar) */
  criarEvento(payload: {
    idCliente: number;
    data: string;
    evento?: string | null;
    tz?: string;
    idUsuario?: number;
  }): Observable<EventoClienteDTO> {
    return this.http.post<EventoClienteDTO>(`${environment.apiURL}/clientes/eventos`, payload);
  }
}

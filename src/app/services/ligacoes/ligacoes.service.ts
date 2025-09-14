import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/interfaces/ICliente';

interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiPage {
  data: Cliente[];
  meta: ApiMeta;
}

@Injectable({ providedIn: 'root' })
export class LigacoesService {
  private base = `${environment.apiURL}/ligacoes`;

  constructor(private http: HttpClient) {}

  // Lista de clientes sem ligação no dia
  getClientesParaLigacao(filtros?: any) {
    let params = '';
    if (filtros) {
      params = '?' + Object.entries(filtros)
        .filter(([_, v]) => v !== undefined && v !== null && String(v) !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
    }
    return this.http.get<ApiPage>(`${this.base}/clientes${params}`);
  }

  // Marca/atualiza ligação do dia
  marcarLigacao(payload: { idCliente: number; dia?: string; data?: string; atendido: boolean; observacao?: string; }) {
    return this.http.post(`${this.base}`, payload);
  }
}

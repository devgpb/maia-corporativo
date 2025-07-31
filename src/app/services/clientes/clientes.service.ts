import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';
import { INovoPedido } from 'src/app/interfaces/INovoPedido';
import { IConfigExcel } from 'src/app/interfaces/IConfigExcel';
import { Cliente } from 'src/app/interfaces/ICliente';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

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
}

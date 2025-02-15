import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';
import { INovoPedido } from 'src/app/interfaces/INovoPedido';
import { IConfigExcel } from 'src/app/interfaces/IConfigExcel';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  public getPedidos (id: string | undefined = undefined): Observable<IPedido[]>{
    let getuser = ''
    if(id){
      getuser = "/"+id
    }
		return this.http.get<IPedido[]>(`${environment.apiURL}/listar/pedidos${getuser}`)
	}

  public getPedidosRecentes (): Observable<IPedido[]>{
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/recentes`)
	}

  public addDrive (idPedido: any): Observable<any>{
		return this.http.post<any>(`${environment.apiURL}/pedidos/adicionarDrive`, {idPedido: idPedido})
	}


  public getPedido(idPedido: any): Observable<any>{
    const params = new HttpParams().set('idPedido', idPedido);
		return this.http.get<any>(`${environment.apiURL}/pedidos/individual/`, {params})
	}

  public getPedidoHash(hash: any): Observable<any>{
    const params = new HttpParams().set('hash', hash);
		return this.http.get<any>(`${environment.apiURL}/pedidos/individual/externo`, {params})
	}


  public getPedidosByStatus(status: string, id: string | undefined = undefined, cargo: string | undefined = undefined): Observable<IPedido[]>{
    let getuser = ''
    if(id){
      getuser = id
    }
    // enviar cargo
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/listar/${getuser}`, {
      params: {
        cargo,
        status
      }
    })
  }

  public getPedidosFilter(filter: any): Observable<IPedido[]> {
    let params = new HttpParams();

    Object.keys(filter).forEach(key => {
      if (typeof filter[key] === 'object' && filter[key] !== null) {
        Object.keys(filter[key]).forEach(subKey => {
          params = params.append(`detalhes[${subKey}]`, filter[key][subKey]);
        });
      } else {
        params = params.append(key, filter[key]);
      }
    });

    return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/listar/`, { params });
}


  public getProcessando (id: string | undefined = undefined): Observable<IPedido[]>{
    let getuser = ''
    if(id){
      getuser = "/"+id
    }
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/processando${getuser}`)
	}

  public getInstalar (id: string | undefined = undefined): Observable<IPedido[]>{
    let getuser = ''
    if(id){
      getuser = "/"+id
    }
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/instalar${getuser}`)
	}

  public getFinalizado (id: string | undefined = undefined): Observable<IPedido[]>{
    let getuser = ''
    if(id){
      getuser = "/"+id
    }
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/finalizado${getuser}`)
	}

  public avancarPedido(idPedido: any): Observable<IPedido[]>{
		return this.http.post<IPedido[]>(`${environment.apiURL}/pedidos/avancar/${idPedido}`,{})
	}

  public avancarPedidos(listaIds: Array<number>): Observable<boolean>{
		return this.http.post<boolean>(`${environment.apiURL}/pedidos/avancarLista`, {lista: listaIds})
	}

  public handleMultiplePedidos(listaIds: Array<number | string>, acao: string, status = undefined): Observable<boolean>{
    return this.http.post<boolean>(`${environment.apiURL}/pedidos/multiplos`,
      {lista: listaIds, acao: acao, status: status}
    );
  }

  public retrocederPedidos(listaIds: Array<number>): Observable<boolean>{
		return this.http.post<boolean>(`${environment.apiURL}/pedidos/retrocederLista`, {lista: listaIds})
	}

  public updatePedido(idPedido: any,pedido: any): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/${idPedido}`, pedido)
	}

  public retrocederPedido(idPedido: any): Observable<IPedido[]>{
		return this.http.post<IPedido[]>(`${environment.apiURL}/pedidos/retroceder/${idPedido}`,{})
	}

  public deletePedidos (idPedido:string): Observable<boolean>{
    return this.http.delete<boolean>(`${environment.apiURL}/pedidos/${idPedido}`)
	}

  public setPedido(formData: FormData): Observable<INovoPedido> {
    return this.http.post<INovoPedido>(`${environment.apiURL}/pedidos`, formData);
  }

  public finalizarPedido(formData: FormData): Observable<INovoPedido> {
    return this.http.post<any>(`${environment.apiURL}/pedidos/finalizar`, formData);
  }

  public vistoriaInicial(formData: FormData): Observable<INovoPedido> {
    return this.http.post<any>(`${environment.apiURL}/pedidos/vistoria/incial`, formData);
  }

  public marcarStandby(idPedido: any): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/marcarStandby/`, {idPedido})
	}

  public removerStandby(idPedido: any): Observable<string>{
		return this.http.post<string>(`${environment.apiURL}/pedidos/removerStandby/`, {idPedido})
	}

  public marcarPerdido(idPedido: any): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/marcarPerdido/${idPedido}`, {})
	}

  public removerPerdido(idPedido: any): Observable<string>{
		return this.http.post<string>(`${environment.apiURL}/pedidos/removerPerdido/${idPedido}`, {})
	}

  public baixarListaPedidos(config:IConfigExcel): Observable<any>{
    return this.http.post(`${environment.apiURL}/templates/excel`, config, {responseType: 'blob'})
  }

}

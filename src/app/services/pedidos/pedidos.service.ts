import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';
import { INovoPedido } from 'src/app/interfaces/INovoPedido';

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
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos${getuser}`)
	}

  public getPedidosByStatus(status: string, id: string | undefined = undefined){
    let getuser = ''
    if(id){
      getuser = "/"+id
    }

		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/${status}${getuser}`)
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

  public updatePedido(idPedido: any,pedido: IPedido): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/${idPedido}`, pedido)
	}

  public retrocederPedido(idPedido: any): Observable<IPedido[]>{
		return this.http.post<IPedido[]>(`${environment.apiURL}/pedidos/retroceder/${idPedido}`,{})
	}

  public deletePedidos (idPedido:string): Observable<boolean>{
    return this.http.delete<boolean>(`${environment.apiURL}/pedidos/${idPedido}`)
	}

  public setPedido (pedido: INovoPedido): Observable<INovoPedido>{
		return this.http.post<INovoPedido>(`${environment.apiURL}/pedidos`,  pedido )
	}

  public marcarStandby(idPedido: any): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/marcarStandby/${idPedido}`, {})
	}

  public removerStandby(idPedido: any): Observable<string>{
		return this.http.put<string>(`${environment.apiURL}/pedidos/removerStandby/${idPedido}`, {})
	}

  public marcarPerdido(idPedido: any): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/marcarPerdido/${idPedido}`, {})
	}

  public removerPerdido(idPedido: any): Observable<string>{
		return this.http.put<string>(`${environment.apiURL}/pedidos/removerPerdido/${idPedido}`, {})
	}
}

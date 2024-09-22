import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class EquipamentosService {

  constructor(private http: HttpClient) { }

  public getEquipamentos(): Observable<any>{
		return this.http.get(`${environment.apiURL}/equipamentos`);
  }

  public getTiposEquipamentos(tipo: string): Observable<any>{
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',  
      'Pragma': 'no-cache'
    });

		return this.http.get(`${environment.apiURL}/equipamentos/listar/${tipo}`, { headers });
  }

  public putEquipamentos(equipamento: any): Observable<any>{
		return this.http.put(`${environment.apiURL}/equipamentos/editar/`, equipamento);
  }

  public deleteEquipamento(id:any): Observable<any>{
		return this.http.delete(`${environment.apiURL}/equipamentos/${id}`);
  }

  public getDimencionamentoWord( equipamento ): Observable<Blob>{
    let params = new HttpParams();
    Object.keys(equipamento).forEach(key => {
      params = params.append(key, equipamento[key]);
    });

		return this.http.get(`${environment.apiURL}/equipamentos/dimensionamento/word`, { params, responseType: 'blob' }).pipe(tap(blob => this.triggerDownload(blob, `dimensionamento.docx`)));;
  }

  public getDimencionamento( equipamento ): Observable<any>{
    let params = new HttpParams();
    Object.keys(equipamento).forEach(key => {
      params = params.append(key, equipamento[key]);
    });

		return this.http.get(`${environment.apiURL}/equipamentos/dimensionamento`, { params });;
  }

  public postEquipamento (info : any): Observable<any>{
		return this.http.post(`${environment.apiURL}/equipamentos`, info);
	}


  private triggerDownload(data: Blob, filename: string) {
    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    // Esta parte irá disparar o download
    document.body.appendChild(anchor);
    anchor.click();

    // Limpeza
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
}
}

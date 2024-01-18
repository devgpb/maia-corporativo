import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
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
		return this.http.get(`${environment.apiURL}/equipamentos/listar/${tipo}`);
  }

  public putEquipamentos(equipamento: any): Observable<any>{
		return this.http.put(`${environment.apiURL}/equipamentos/editar/`, equipamento);
  }

  public deleteEquipamento(id:any): Observable<any>{
		return this.http.delete(`${environment.apiURL}/equipamentos/${id}`);
  }

  public getDimencionamento( equipamento ): Observable<Blob>{
    let params = new HttpParams();
    Object.keys(equipamento).forEach(key => {
      params = params.append(key, equipamento[key]);
    });

		return this.http.get(`${environment.apiURL}/equipamentos/dimencionamento`, { params, responseType: 'blob' }).pipe(tap(blob => this.triggerDownload(blob, `dimencionamento.docx`)));;
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

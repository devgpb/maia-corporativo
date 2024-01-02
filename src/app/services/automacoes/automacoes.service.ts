import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IEvento } from 'src/app/interfaces/IEvento';

@Injectable({
  providedIn: 'root'
})
export class AutomacoesService {

  constructor(private http: HttpClient) { }

  public getContratoWord (info : any): Observable<Blob>{

		return this.http.post(`${environment.apiURL}/templates/contrato`, info, { responseType: 'blob' })
        .pipe(tap(blob => this.triggerDownload(blob, `contrato_${info.numeroContrato}.docx`)));
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

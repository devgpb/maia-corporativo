import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IEvento } from 'src/app/interfaces/IEvento';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutomacoesService {

  constructor(private http: HttpClient) { }

  public getContratoWord(tipoContrato: any, info: any): Observable<HttpResponse<Blob>> {
    const contrato = { tipoContrato: tipoContrato, camposContrato: info };

    return this.http.post(`${environment.apiURL}/templates/contrato`, contrato, { observe: 'response', responseType: 'blob' })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          let filename = this.extractFilename(response);
          if (response.body) {
            this.triggerDownload(response.body, filename);
          } else {
            // Lidar com o erro ou situação em que não há corpo na resposta.
          }
        })
      );
  }

  // public getPropostaWord(proposta: any): Observable<HttpResponse<Blob>> {

  //   return this.http.post(`${environment.apiURL}/templates/proposta`, proposta, { observe: 'response', responseType: 'blob' })
  //     .pipe(
  //       tap((response: HttpResponse<Blob>) => {
  //         let filename = this.extractFilename(response);
  //         if (response.body) {
  //           this.triggerDownload(response.body, filename);
  //         } else {
  //         }
  //       })
  //     );
  // }
  public getPropostaWord(proposta: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/automacao/`, proposta)
  }

  public getProcuracaoWord(info: any): Observable<HttpResponse<Blob>> {

    return this.http.post(`${environment.apiURL}/templates/procuracao`, info, { observe: 'response', responseType: 'blob' })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          let filename = this.extractFilename(response);
          if (response.body) {
            this.triggerDownload(response.body, filename);
          } else {
            // Lidar com o erro ou situação em que não há corpo na resposta.
          }
        }),
      );
  }

  private extractFilename(res: HttpResponse<Blob>): string {
    const contentDisposition = res.headers.get('Content-Disposition') || '';

    // Regex atualizada para lidar com nomes de arquivo que incluem caracteres como '_'
    const matches = /filename="([^"]+)"/.exec(contentDisposition) || /filename=([^;]+)/.exec(contentDisposition);
    if (matches && matches[1]) {
      return matches[1];
    } else {
      return 'contrato_default.docx';
    }
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

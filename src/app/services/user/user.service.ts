import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IUser } from 'src/app/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public atualizarUser(dados: any, idUser: string): Observable<boolean>{
		return this.http.put<boolean>(`${environment.apiURL}/usuarios/${idUser}`,dados)
	}

  public cadastrarUser(dados: any): Observable<boolean>{
		return this.http.post<boolean>(`${environment.apiURL}/usuarios`,dados)
	}

  public deletarUser(id: any): Observable<any>{
		return this.http.delete(`${environment.apiURL}/usuarios/${id}`)
	}

  public getColaboradores (): Observable<any[]>{
		return this.http.get<any[]>(`${environment.apiURL}/usuarios/colaboradores`)
	}

  public getAllUsuarios(): Observable<any[]>{
		return this.http.get<any[]>(`${environment.apiURL}/usuarios`)
	}

  public getCargos (): Observable<any[]>{
		return this.http.get<any[]>(`${environment.apiURL}/usuarios/cargos`)
	}
}

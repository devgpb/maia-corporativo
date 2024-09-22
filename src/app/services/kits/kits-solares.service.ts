import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class KitsSolaresService {
  private baseUrl = environment.apiURL + '/kits'; // Ajuste conforme necessário

  constructor(private http: HttpClient) { }

  getAllKitsSolares(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getKitSolarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createKitSolar(kit: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, kit);
  }

  updateKitSolar(id: number, kit: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, kit);
  }

  deleteKitSolar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

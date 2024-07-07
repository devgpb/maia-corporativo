import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketURL, {
      withCredentials: true,
      extraHeaders: {
          "my-custom-header": "abcd"
      }
    });
  }

  public getNovoPedido(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('novoPedido', (pedido: any) => {
        observer.next(pedido);
      });
    });
  }
}

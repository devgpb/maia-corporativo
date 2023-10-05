import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { IPedido } from '../interfaces/IPedido';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {


  list: IPedido[] = [];

  constructor(
    private pedidosService:PedidosService,
    private webSocketService:WebSocketService
  ) { }

  ngOnInit(): void {
    
    this.pedidosService.getPedidos().subscribe(pedidos =>{
      console.log(pedidos)
      this.list = pedidos
    })

    this.webSocketService.getNovoPedido().subscribe((novoPedido: IPedido) => {
      this.list.push(novoPedido);
    });
  }

  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return data.toLocaleDateString('pt-BR', options);
  }

}

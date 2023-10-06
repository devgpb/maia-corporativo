import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';

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
    private webSocketService:WebSocketService,
    private modalService: ModalService,
    private viewContainerRef: ViewContainerRef
  ) {
    this.detalhes = {}
  }

  detalhes: IPedido | any;

  ngOnInit(): void {

    this.pedidosService.getPedidos().subscribe(pedidos =>{
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

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  formatLabel(label: string) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  abrirDetalhes(pedido: IPedido){
    this.openModal()
    this.detalhes = pedido;
  }
  openModal() {
    this.modalService.show();
  }

  closeModal() {
    this.modalService.hide();
  }

}

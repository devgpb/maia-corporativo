import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';

import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';



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

  deletarPedido(pedido: IPedido){

    Swal.fire({
      title: 'Deseja mesmo apagar o pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.deletePedidos(pedido.idPedido as string).subscribe(apagado =>{
          if(apagado){
            Swal.fire({
              icon: "success",
              title: "Pedido Apagado!",
              confirmButtonColor: "#3C58BF"
            });
            const index = this.list.indexOf(pedido);
            this.list.splice(index,1)
          }else{
            Swal.fire({
              icon: "error",
              title: "Pedido Não Apagado!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Pedido não foi apagado.', '', 'info');
      }
    });

  }

  openModal() {
    this.modalService.show();
  }

  closeModal() {
    this.modalService.hide();
  }

}

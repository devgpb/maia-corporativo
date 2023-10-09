import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';
import { AuthService } from '../services/auth/auth.service';

import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-finalizados',
  templateUrl: './finalizados.component.html',
  styleUrls: ['./finalizados.component.scss']
})
export class FinalizadosComponent  implements OnInit{


  list: IPedido[] = [];

  constructor(
    private pedidosService:PedidosService,
    private webSocketService:WebSocketService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.detalhes = {}
  }

  detalhes: IPedido | any;

  ngOnInit(): void {

    this.pedidosService.getInstalar().subscribe(pedidos =>{
      this.list = pedidos
    })

    // this.webSocketService.getNovoPedido().subscribe((novoPedido: IPedido) => {
    //   this.list.push(novoPedido);
    // });
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

  avancarPedido(pedido: IPedido){
    this.pedidosService.avancarPedido(pedido.idPedido).subscribe(avancado =>{
      if(avancado){
        Swal.fire({
          icon: "success",
          title: "Pedido Avançado!",
          confirmButtonColor: "#3C58BF"
        });
        const index = this.list.indexOf(pedido);
        this.list.splice(index,1)
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedido Não Avançado!",
        });
      }
    })
  }
  retrocederPedido(pedido: IPedido){
      Swal.fire({
        title: 'Deseja mesmo retroceder o pedido?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then((result) => {
        if (result.isConfirmed) {
          this.pedidosService.retrocederPedido(pedido.idPedido).subscribe(avancado =>{
            if(avancado){
              Swal.fire({
                icon: "success",
                title: "Pedido Retrocedido!",
                confirmButtonColor: "#3C58BF"
              });
              const index = this.list.indexOf(pedido);
              this.list.splice(index,1)
            }else{
              Swal.fire({
                icon: "error",
                title: "Pedido Não Retrocedido!",
              });
            }
          })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Pedido não foi apagado.', '', 'info');
        }
      });
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


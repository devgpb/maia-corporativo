import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { AuthService } from '../services/auth/auth.service';
import { IPedido } from '../interfaces/IPedido';
import { ModalService } from '../services/modal/modal.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-homologacoes',
    templateUrl: './homologacoes.component.html',
    styleUrls: ['./homologacoes.component.scss'],
    standalone: false
})
export class HomologacoesComponent implements OnInit {

  public pedidos: any[] = [];
  public status: string = "homologar";
  public user: any;
  public showEdit: boolean = false;
  public pedido: IPedido | undefined;


  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService,
    private modalService: ModalService,

  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.carregarPedidos();

    // Carregar pedidos a cada 1m
    setInterval(() => {
      console.log('Carregando pedidos...');
      this.carregarPedidos();
    }, 60000);
  }

  carregarPedidos(){
    this.pedidosService.getPedidosByStatus(this.status,undefined, this.user.cargo).subscribe(pedidos => {
      console.log(pedidos)
      this.pedidos = pedidos;
    })
  }

  abrirEdicao(pedido: IPedido){
    this.showEdit = true
    this.pedido = pedido;
    this.toggleModal()
  }

  toggleModal() {
    this.modalService.toggle();
  }


  marcarHomologado(pedido: IPedido) {
    Swal.fire({
      title: `Deseja mesmo marcar o pedido de ${pedido.nomeCompleto}?`,
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, marcar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const dados = {
          idPedido: pedido.idPedido,
          detalhes: {
            homologado: true,
          },
        };

        this.pedidosService.updatePedido(pedido.idPedido, dados).subscribe({
          next: (response) => {
            if (response) {
              // Ativa a animação antes de remover o card
              pedido["animating"] = true;
              setTimeout(() => {
                this.pedidos = this.pedidos.filter((p) => p !== pedido);
              }, 500); // Sincronize com o tempo da animação
              Swal.fire({
                icon: 'success',
                title: 'Pedido homologado!',
                text: `O pedido de ${pedido.nomeCompleto} foi homologado com sucesso.`,
              });
            } else {
              // Exibe mensagem de erro se não for homologado
              Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Não foi possível marcar como homologado. Tente novamente.',
                confirmButtonText: 'OK',
              });
            }
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: 'Houve um problema ao conectar ao servidor. Tente novamente.',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    });
  }


  getTempoPedido(pedido: IPedido): any {

      // Converter a data de ISO string para Date
      const dataPedido = new Date(pedido.dataPedido);
      const dataAtual = new Date();

      // Calcular a diferença em milissegundos
      const diffMillis = dataAtual.getTime() - dataPedido.getTime();

      // Converter para dias (1 dia = 24 * 60 * 60 * 1000 ms)
      const diasPassados = Math.floor(diffMillis / (24 * 60 * 60 * 1000));

      if (diasPassados === 0) {
        return 'Hoje';
      } else if (diasPassados === 1) {
        return '1 dia';
      } else {
        return `${diasPassados} dias`;
      }
  }
}

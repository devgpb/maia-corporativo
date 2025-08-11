import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPedido } from 'src/app/interfaces/IPedido';

@Component({
    selector: 'card-cliente',
    templateUrl: './card-cliente.component.html',
    styleUrls: ['./card-cliente.component.scss'],
    standalone: false
})
export class CardClienteComponent {
  // Recebe o objeto de pedido
  @Input() pedido!: IPedido;

  // Emite o evento quando o card é clicado
  @Output() cardClick: EventEmitter<IPedido> = new EventEmitter<IPedido>();

  constructor() {}

  // Ao clicar no card (exceto em elementos que interrompam a propagação)
  onCardClick(event: MouseEvent): void {
    this.cardClick.emit(this.pedido);
  }

  // Calcula o tempo decorrido desde a data do pedido
  getTempoPedido(): string {
    if (!this.pedido || !this.pedido.dataPedido) {
      return '';
    }

    const dataPedido = new Date(this.pedido.dataPedido);
    const dataAtual = new Date();
    const diffMillis = dataAtual.getTime() - dataPedido.getTime();
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

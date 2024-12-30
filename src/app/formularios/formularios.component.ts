import { Component } from '@angular/core';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent {

  public qrLink = null;

  constructor(
    private modalService: ModalService,
  ){

  }

  public dadosFormulario = [
    {
      link: '/pedido/criar/externo',
      titulo: "Fechamento de Pedido",
      icon: "fas fa-check-circle",
      desc: 'Formulário para fechamento de pedido',
      linkQr: environment.url + '/pedido/criar/externo',
    },
    {
      link: '/pedido/finalizar/externo',
      titulo: "Filanização de Pedido",
      icon: "fas fa-file-signature",
      desc: 'Formulário para fechamento de pedido',
      linkQr: environment.url + '/pedido/finalizar/externo',
    }
  ]

  abrirModal(event: any, link: string) {
    event.preventDefault();
    this.qrLink = link;
    this.modalService.toggle();
  }

  toggleModal() {
    this.modalService.toggle();
  }
}

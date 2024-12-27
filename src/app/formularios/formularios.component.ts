import { Component } from '@angular/core';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent {

  public dadosFormulario = [
    {
      link: '/pedido/finalizar/externo',
      titulo: "Filanização de Pedido",
      icon: "fas fa-file-signature",
      desc: 'Formulário para fechamento de pedido'
    }
  ]
}

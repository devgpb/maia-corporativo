import { Component } from '@angular/core';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent {

  public dadosFormulario = [
    {
      link: "https://forms.gle/AR3d5nJVD5S1QkZ48",
      titulo: "Fechamento de Pedido",
      icon: "fa-check-circle",
      desc: 'Formulário para fechamento de pedido'
    }
  ]
}

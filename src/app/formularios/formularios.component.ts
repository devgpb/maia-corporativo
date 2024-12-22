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
    // {
    //   link: environment.linkFormFechado,
    //   titulo: "Fechamento de Pedido",
    //   icon: "fa-check-circle",
    //   desc: 'Formulário para fechamento de pedido'
    // }
  ]
}

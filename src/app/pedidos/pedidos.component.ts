import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Constantes from "../constants";

@Component({
    selector: 'app-pedidos',
    templateUrl: './pedidos.component.html',
    styleUrls: ['./pedidos.component.scss'],
    standalone: false
})
export class PedidosComponent {
  status: string = '';
  rotaEspecial: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.rotaEspecial = Constantes.rotasEspeciais.indexOf(params['status']) !== -1;
      this.status = params['status'];
    });
  }
}

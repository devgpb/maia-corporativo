import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentPage: string = 'pedidos';
  public nomePedido: string = undefined;
  public userName: string = ''
  private storageSub: Subscription;

	constructor (
		private router: Router,
    private authService: AuthService,
    private storageService: StorageService
	) {

	}

  ngOnInit(): void {
      this.userName = this.authService.getUser().nomeCompleto.split(' ')[0];
      this.carregarPedidoInicial();
      this.observarMudancasNoPedido();
  }

  private carregarPedidoInicial() {
    const pedido = JSON.parse(localStorage.getItem('pedido'));
    if (pedido) {
      this.nomePedido = pedido.nomeCompleto;
    }
  }

  private observarMudancasNoPedido() {
    this.storageSub = this.storageService.watchStorage().subscribe((data: { key?: string; value?: any }) => {
      if (data && data.key === 'pedido') {
        const pedidoAtualizado = data.value ? JSON.parse(data.value) : null;
        this.nomePedido = pedidoAtualizado ? pedidoAtualizado.nomeCompleto : '';
      }
    });
  }

	public logout (): void {
		this.authService.logout();
	}

  deletePedido() {
    this.storageService.removeItem('pedido');
  }

  ngOnDestroy() {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
  }
}

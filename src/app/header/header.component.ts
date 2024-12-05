import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { PedidosService } from '../services/pedidos/pedidos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentPage: string = 'pedidos';
  public nomePedido: string = undefined;
  public userName: string = '';
  private storageSub: Subscription;
  public notifications: any[] = [];
  public showNotifications: boolean = false;
  public hasNewNotifications: boolean = true;
  private socketSub: Subscription;
  private globalClickListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private webSocketService: WebSocketService,
    private pedidosService: PedidosService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getUser().nomeCompleto.split(' ')[0];

    this.carregarPedidoInicial();
    this.pedidosService.getPedidosRecentes().subscribe(pedidos => {
      pedidos.forEach(pedido => {
        this.notifications.push({nomeCompleto: pedido.nomeCompleto, endereco: pedido.endereco});
      });
    });
    this.observarMudancasNoPedido();
    this.listenForNotifications();
    this.globalClickListener = this.renderer.listen('window', 'click', (e: Event) => {
      const notificationsDropdown = document.getElementById('notifications-dropdown');
      if (notificationsDropdown && !notificationsDropdown.contains(e.target as Node)) {
        this.showNotifications = false;
      }
    });
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

  private listenForNotifications() {
    this.socketSub = this.webSocketService.getNovoPedido().subscribe((pedido: any) => {
      this.notifications.unshift(pedido);
      this.hasNewNotifications = true;
      this.playNotificationSound();
    });
  }

  private playNotificationSound() {
    const permission = localStorage.getItem('notification-permission');
    if (permission === 'granted') {
      const audio = new Audio('assets/audio/chegou_pedido.mp3');
      console.log("som, oi");
      audio.play();
    }
  }

  public toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.hasNewNotifications = false;
    }
  }

  public logout(): void {
    this.authService.logout();
  }

  public deletePedido() {
    this.storageService.removeItem('pedido');
  }

  ngOnDestroy() {
    if (this.storageSub) {
      this.storageSub.unsubscribe();
    }
    if (this.socketSub) {
      this.socketSub.unsubscribe();
    }
    if (this.globalClickListener) {
      this.globalClickListener();
    }
  }
}

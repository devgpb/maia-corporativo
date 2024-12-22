import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class AppComponent implements OnInit {
  title = 'Sistema Corporativo';
  public menuCollapsed: boolean = false;
  public isLogin: boolean = false;
  public isExternal: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(_ => {
      this.isLogin = this.router.url.substr(1).indexOf("login") === 0;
    });
  }

  ngOnInit(): void {
    if (!this.isLogin) {
      this.checkNotificationPermission();
    }
    const fullUrl = window.location.href
    this.isExternal = fullUrl.endsWith('externo');
    console.log('isExternal', this.isExternal);
    console.log("fullUrl", fullUrl)
  }

  private checkNotificationPermission() {
    const permission = localStorage.getItem('notification-permission');
    if (permission !== 'granted' && (Notification.permission !== 'granted' || permission == null) ) {
      this.showNotificationPermissionAlert();
    }
  }

  private showNotificationPermissionAlert() {
    Swal.fire({
      title: 'Ativar Notificações',
      text: 'Para receber notificações de novos pedidos, ative as notificações.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ativar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestNotificationPermission();
      }
    });
  }

  private requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        localStorage.setItem('notification-permission', 'granted');
        Swal.fire('Notificações Ativadas!', 'Você receberá notificações de novos pedidos.', 'success');
      } else {
        localStorage.setItem('notification-permission', 'denied');
        Swal.fire('Notificações Não Ativadas', 'Você não receberá notificações de novos pedidos.', 'error');
      }
    });
  }
}

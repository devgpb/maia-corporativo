import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('slideToggle', [
      state('closed', style({
        height: '0px',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: '1'
      })),
      transition('closed => open', [
        animate('0.3s ease-in')
      ]),
      transition('open => closed', [
        animate('0.3s ease-out')
      ]),
    ]),
  ]
})

export class MenuComponent implements OnInit {

    public userCargo = ""
    public isOpen = false; // para controlar a visibilidade do submenu

    constructor(
      private authService:AuthService,
      private router: Router
    ){

      this.userCargo = this.authService.getUser().cargo

    }

    ngOnInit(): void {
      // this.checkAccount();
    }

    toggleSubmenu(): void {
      this.isOpen = !this.isOpen;
    }

    isActive(route: string): boolean {
      return this.router.url === route;
    }
}

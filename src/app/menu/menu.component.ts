import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class MenuComponent implements OnInit {

    public userCargo = ""
    public isOpen = false; // para controlar a visibilidade do submenu
    public menuSelected = ""

    constructor(
      private authService:AuthService,
      private router: Router
    ){

      this.userCargo = this.authService.getUser().cargo

    }

    ngOnInit(): void {
      // this.checkAccount();
    }

    toggleSubmenu(selected: string): void {
      if(selected == this.menuSelected || !this.isOpen == true)
        this.isOpen = !this.isOpen;
      this.menuSelected = selected
    }

    isActive(route: string): boolean {
      return this.router.url === route;
    }
}

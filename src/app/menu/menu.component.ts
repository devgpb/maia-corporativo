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
    public _isOpen = false; // para controlar a visibilidade do submenu
    public _menuSelected = ""

    constructor(
      private authService:AuthService,
      private router: Router
    ){

      this.userCargo = this.authService.getUser().cargo

    }

    // Supondo que isOpen e menuSelected são propriedades da sua classe de componente
    set isOpen(value) {
      this._isOpen = value;
      localStorage.setItem('isOpen', JSON.stringify(value));
    }

    set menuSelected(value) {
      this._menuSelected = value;
      localStorage.setItem('menuSelected', JSON.stringify(value));
    }

    // Métodos getter para recuperar os valores
    get isOpen() {
      return JSON.parse(localStorage.getItem('isOpen')) || this._isOpen;
    }

    get menuSelected() {
      return JSON.parse(localStorage.getItem('menuSelected')) || this._menuSelected;
    }


    ngOnInit(): void {
      // this.checkAccount();
      this._isOpen = JSON.parse(localStorage.getItem('isOpen')) || false; // valor padrão se não estiver definido
      this._menuSelected = JSON.parse(localStorage.getItem('menuSelected')) || null; // valor padrão
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

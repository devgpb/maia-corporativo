import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from "src/environments/environment";
import * as Constantes from "../constants";



@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})

export class MenuComponent implements OnInit {
    public Constantes = Constantes;
    public userCargo = "";
    private _isOpen = false; // para controlar a visibilidade do submenu
    private _menuSelected = "";
    public linkFormFechado = environment.linkFormFechado;
    constructor(
      private authService: AuthService,
      private router: Router
    ){
      this.userCargo = this.authService.getUser().cargo;
    }

    // Supondo que isOpen e menuSelected são propriedades da sua classe de componente
    set isOpen(value: boolean) {
      this._isOpen = value;
      localStorage.setItem('isOpen', JSON.stringify(value));
    }

    set menuSelected(value: string) {
      this._menuSelected = value;
      localStorage.setItem('menuSelected', JSON.stringify(value));
    }

    // Métodos getter para recuperar os valores
    get isOpen(): boolean {
      return JSON.parse(localStorage.getItem('isOpen') || 'false');
    }

    get menuSelected(): string {
      return JSON.parse(localStorage.getItem('menuSelected') || 'null');
    }

    ngOnInit(): void {
      // Inicializa estados com base no Local Storage ou valores padrão
      this._isOpen = JSON.parse(localStorage.getItem('isOpen') || 'false');
      this._menuSelected = JSON.parse(localStorage.getItem('menuSelected') || 'null');
    }

    toggleSubmenu(selected: string): void {
      if (selected === this.menuSelected && this.isOpen) {
        this.isOpen = false;
      } else {
        this.isOpen = true;
        this.menuSelected = selected;
      }
    }

    isActive(route: string): boolean {
      return this.router.url === route;
    }
}

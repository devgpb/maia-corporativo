import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from 'src/environments/environment';
import * as Constantes from '../constants';

@Component({
  selector: 'app-novo-menu',
  templateUrl: './novo-menu.component.html',
  styleUrls: ['./novo-menu.component.scss'],
  animations: [
    // Trigger para o menu principal (apenas fade in/out)
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    // Trigger para o submenu – definindo a transição tanto na entrada quanto na saída
    trigger('submenuFade', [
      transition('void => visible', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class NovoMenuComponent implements OnInit {
  public Constantes = Constantes;
  public userCargo = '';
  public linkFormFechado = environment.linkFormFechado;

  // Flags para controlar qual menu exibir
  public showMainMenu = true;
  public showSubmenu = false;

  // Estado da animação do submenu: 'visible' ou 'hidden'
  public submenuAnimationState: 'visible' | 'hidden' = 'visible';

  // Indica qual submenu está selecionado
  public menuSelected: string = '';

  // Definição dos submenus
  public submenus = {
    pedidos: [
      { title: 'Novo Pedido', icon: 'fa-solid fa-circle-plus', route: 'pedido/criar' },
    ],
    automacoes: [
      { title: 'Gerar Proposta', icon: 'fa-solid fa-file-alt', route: 'proposta/gerar' },
      {
        title: 'Gerar Procuração',
        icon: 'fa-solid fa-file-alt',
        route: 'procuracao/gerar',
        condition: (userCargo: string) => userCargo === 'ADMINISTRADOR'
      }
    ]
  };

  constructor(
    private authService: AuthService,
    public router: Router
  ) {
    // Exemplo: definindo userCargo
    this.userCargo = this.authService.getUser().cargo;
  }

  ngOnInit(): void {
    // Verifica se há um submenu salvo na memória (localStorage)
    const lastSubmenu = localStorage.getItem('lastVisitedSubmenu');
    if (lastSubmenu) {
      // Se existir, carrega o submenu salvo e exibe-o imediatamente
      this.menuSelected = lastSubmenu;
      this.showMainMenu = false;
      this.showSubmenu = true;
      this.submenuAnimationState = 'visible';
    }
  }

  /**
   * Ao clicar num item que possui submenu:
   * 1) Salva o submenu selecionado no localStorage.
   * 2) Oculta o menu principal (inicia a animação de fade out).
   * 3) No callback da animação do menu principal, o submenu é exibido (fade in).
   */
  toggleSubmenu(selected: string): void {
    // Salva o submenu selecionado (último submenu visitado)
    localStorage.setItem('lastVisitedSubmenu', selected);
    this.menuSelected = selected;
    // Inicia a animação para esconder o menu principal
    this.showMainMenu = false;
  }

  /**
   * Callback disparado quando a animação do menu principal termina (fade out).
   * Se ele realmente saiu (toState === 'void'), mostramos o submenu.
   */
  onMainMenuAnimationDone(event: any): void {
    if (event.toState === 'void') {
      this.showSubmenu = true;
      this.submenuAnimationState = 'visible';
    }
  }

  /**
   * Ao clicar no botão "Voltar" do submenu, dispara a animação de saída.
   * Observação: nesse exemplo, o submenu salvo permanece em memória, ou seja,
   * mesmo que o usuário volte para o menu principal, na próxima renderização
   * o último submenu será exibido.
   *
   * Caso deseje limpar o submenu salvo ao voltar, descomente a linha:
   * // localStorage.removeItem('lastVisitedSubmenu');
   */
  goBack(): void {
    this.submenuAnimationState = 'hidden';
    localStorage.removeItem('lastVisitedSubmenu');
    // Se preferir limpar o submenu salvo, descomente a linha abaixo:
    // localStorage.removeItem('lastVisitedSubmenu');
  }

  /**
   * Callback disparado quando a animação do submenu termina.
   * Se o submenu estiver saindo (toState === 'hidden'), esconde-o e volta a mostrar o menu principal.
   */
  onSubmenuAnimationDone(event: any): void {
    if (event.toState === 'hidden') {
      this.showSubmenu = false;
      this.showMainMenu = true;
    }
  }

  /**
   * Verifica se a rota atual é igual à do item (para highlight, etc.)
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Verifica se o usuário possui algum dos cargos permitidos para o item.
   */
  hasRole(roles: string[]): boolean {
    if (roles.length === 0) return true;
    return roles.includes(this.userCargo);
  }
}

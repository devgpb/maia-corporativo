import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { PedidosService } from '../services/pedidos/pedidos.service';


interface MenuItem {
  icon: string;
  title: string;
  description?: string;
  href?: string;
  roles?: string[];
  hasSubmenu?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-novo-menu',
  templateUrl: './novo-menu.component.html',
  styleUrls: ['./novo-menu.component.scss']
})
export class NovoMenuComponent implements OnInit {
  public userCargo: string = '';
  public showMainMenu: boolean = true;
  public showSubmenu: boolean = false;
  public hoveredCard: string | null = null;
  public activeSubmenu: string = ''; // Armazena o título do item que possui submenu ativo

  // Menu principal
  public menuSections: MenuSection[] = [

    {
      title: 'Vendas',
      items: [
        {
          icon: 'phone',
          title: 'Lista Contatos',
          description: 'Todos os contatos disponíveis para abordagem',
          href: '/vendas/contatos',
          roles: ['ADMINISTRADOR']
        },

      ]
    },
    {
      title: 'Sistema',
      items: [
        {
          icon: 'send',
          title: 'Clientes',
          description: 'Gerencie sua base de clientes',
          hasSubmenu: true
        },
        {
          icon: 'bot',
          title: 'Automações',
          description: 'Configure processos automáticos',
          hasSubmenu: true
        },
        {
          icon: 'table',
          title: 'Relatório',
          description: 'Visualize métricas e relatórios',
          href: '/relatorio',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'wrench',
          title: 'Equipamentos',
          description: 'Gerencie equipamentos do sistema',
          href: '/equipamentos'
        }
      ]
    },
    {
      title: 'Administração',
      items: [
        {
          icon: 'users',
          title: 'Usuários',
          description: 'Gerencie todos os usuários do sistema',
          href: '/ref',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'user-cog',
          title: 'Minha Conta',
          description: 'Configure suas preferências pessoais',
          href: '/conta'
        },
        {
          icon: 'building-2',
          title: 'Setores',
          description: 'Organize os setores da empresa',
          href: '/setores',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'user-plus',
          title: 'Novo Usuário',
          description: 'Adicione novos membros ao sistema',
          href: '/usuarios/novo',
          roles: ['ADMINISTRADOR', 'GESTOR']
        }
      ]
    },
  ];

  // Itens do submenu para "Clientes"
  public submenuClientesRecentItems = [
    {
      icon: 'dollar-sign',
      title: 'Pagamentos Faltantes',
      nome: 'pagamentosFaltantes',
      count: 0,
      route: '/pedidos/detalhes/pagamentos',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: 'box',
      title: 'Equipamentos A Comprar',
      nome: 'equipamentosFaltantes',
      count: 0,
      route: '/pedidos/detalhes/equipamentos',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: 'pen',
      title: 'ART Faltantes',
      nome: 'ARTFaltantes',
      count: 0,
      route: '/pedidos/detalhes/arts',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: 'folder-open',
      title: 'Homologações Pendentes',
      nome: 'homologacoesPendentes',
      count: 0,
      route: '/pedidos/detalhes/homologacoes',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: 'cog',
      title: 'Aguardando Instalação',
      nome: 'aguardandoInstalacao',
      count: 0,
      route: '/pedidos/detalhes/instalar',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  public submenuClientesTableItems = [
    {
      icon: 'file',
      title: 'Fechado',
      count: false,
      route: '/pedidos/status/fechado'
    },
    {
      icon: 'cog',
      title: 'Instalacao',
      count: false,
      route: '/pedidos/status/instalacao'
    },
    {
      icon: 'file',
      title: 'Nota',
      count: false,
      route: '/pedidos/status/nota'
    },
    {
      icon: 'file',
      title: 'Finalizado',
      count: false,
      route: '/pedidos/status/finalizado'
    }
  ];

  // Itens do submenu para "Automações"
  public submenuAutItems = [
    {
      icon: 'file',
      title: 'Gerar Proposta',
      route: '/proposta/gerar'
    },
    {
      icon: 'file',
      title: 'Gerar Procuração',
      route: '/procuracao/gerar',
      roles: ['ADMINISTRADOR']
    }
  ];

  constructor(
    public router: Router,
    private authService: AuthService,
    private pedidosService: PedidosService
  ) {
    this.userCargo = this.authService.getUser().cargo;
  }

  ngOnInit(): void {
    const lastSubmenu = localStorage.getItem('lastVisitedSubmenu');
    if (lastSubmenu) {
      this.activeSubmenu = lastSubmenu;
      this.showMainMenu = false;
      this.showSubmenu = true;
    }

    this.pedidosService.getContadoresGerais().subscribe((contadores) => {
      this.submenuClientesRecentItems.forEach((item) => {
        item.count = contadores[item.nome] || 0;
      });
    });
  }

  onMenuItemClick(item: MenuItem): void {
    // Verifica restrições de acesso (se houver)
    if (item.roles && item.roles.length > 0 && !item.roles.includes(this.userCargo)) {
      return;
    }

    if (item.hasSubmenu) {
      localStorage.setItem('lastVisitedSubmenu', item.title);
      this.activeSubmenu = item.title;
      this.showMainMenu = false;
      this.showSubmenu = true;
    } else if (item.href) {
      this.router.navigate([item.href]);
    }
  }

  goBack(): void {
    this.showSubmenu = false;
    this.showMainMenu = true;
    localStorage.removeItem('lastVisitedSubmenu');
    this.activeSubmenu = '';
  }
}

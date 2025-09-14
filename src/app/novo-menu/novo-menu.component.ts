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
  setores?: string[];
  hasSubmenu?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
    selector: 'app-novo-menu',
    templateUrl: './novo-menu.component.html',
    styleUrls: ['./novo-menu.component.scss'],
    standalone: false
})
export class NovoMenuComponent implements OnInit {
  public userCargo: string = '';
  public showMainMenu: boolean = true;
  public showSubmenu: boolean = false;
  public hoveredCard: string | null = null;
  public userSetor: string = '';
  public activeSubmenu: string = ''; // Armazena o título do item que possui submenu ativo

  // Menu principal
  public menuSections: MenuSection[] = [

    {
      title: 'Vendas',
      items: [
        {
          icon: 'lucideLayoutDashboard',
          title: 'Relatório de Vendas',
          description: 'Acompanhe as métricas de vendas',
          href: '/vendas/dashboard',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        },
        {
          icon: "lucideUserPlus",
          title: 'Cadastrar Clientes',
          description: 'Cadastre seus clientes',
          href: '/vendas/leads',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        },
        {
          icon: 'lucideUsers',
          title: 'Lista de Clientes',
          description: 'Veja todos os clientes cadastrados',
          href: '/vendas/lista/clientes',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        },
        {
          icon: 'lucidePhone',
          title: 'Ligações',
          description: 'Marcar atendimentos por ligação',
          href: '/vendas/ligacoes',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        },
        {
          icon: 'lucideCalendar',
          title: 'Meus Eventos',
          description: 'Veja seu calendário de eventos',
          href: '/vendas/meus/eventos',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        },
        {
          icon: 'lucideMessageCircleMore',
          title: 'Mensagens Padrão',
          description: 'Veja as mensagens padrão dos vendedores',
          href: '/vendas/mensagens-padrao',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores: ['Vendas', 'Marketing'],
        }
      ]
    },
    {
      title: 'Sistema',
      items: [
        {
          icon: 'lucideUsers', // Lucide: users para Clientes
          title: 'Pedidos',
          description: 'Gerencie sua base de pedidos fechados',
          roles: ['GESTOR', 'COLABORADOR', 'ADMINISTRADOR'],
          setores:['Administrativo','Financeiro', 'Homologação'],
          hasSubmenu: true,
        },
        {
          icon: 'lucideBot', // Lucide: bot para Automações
          title: 'Automações',
          description: 'Configure processos automáticos',
          hasSubmenu: true
        },
        {
          icon: 'lucideBarChart2',
          title: 'Relatório',
          description: 'Visualize métricas e relatórios',
          href: '/relatorio',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'lucideServer', // Lucide: server para Equipamentos
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
          icon: 'lucideUsers',
          title: 'Usuários',
          description: 'Gerencie todos os usuários do sistema',
          href: '/ref',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'lucideUserCog',
          title: 'Minha Conta',
          description: 'Configure suas preferências pessoais',
          href: '/conta'
        },
        {
          icon: 'lucideBuilding2',
          title: 'Setores',
          description: 'Organize os setores da empresa',
          href: '/setores',
          roles: ['ADMINISTRADOR']
        },
        {
          icon: 'lucideUserPlus',
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
      icon: 'lucideDollarSign',
      title: 'Pagamentos Faltantes',
      nome: 'pagamentosFaltantes',
      count: 0,
      route: '/pedidos/detalhes/pagamentos',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: 'lucideBox',
      title: 'Equipamentos A Comprar',
      nome: 'equipamentosFaltantes',
      count: 0,
      route: '/pedidos/detalhes/equipamentos',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: 'lucidePen',
      title: 'ART Faltantes',
      nome: 'ARTFaltantes',
      count: 0,
      route: '/pedidos/detalhes/arts',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: 'lucideFolderOpen',
      title: 'Homologações Pendentes',
      nome: 'homologacoesPendentes',
      count: 0,
      route: '/pedidos/detalhes/homologacoes',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: 'lucideCog',
      title: 'Aguardando Instalação',
      nome: 'aguardandoInstalacao',
      count: 0,
      route: '/pedidos/detalhes/instalar',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  public submenuClientesTableItems = [
    {
      icon: 'lucideFile',
      title: 'Fechado',
      count: false,
      route: '/pedidos/status/fechado'
    },
    {
      icon: 'lucideCog',
      title: 'Instalacao',
      count: false,
      route: '/pedidos/status/instalacao'
    },
    {
      icon: 'lucideFile',
      title: 'Nota',
      count: false,
      route: '/pedidos/status/nota'
    },
    {
      icon: 'lucideFile',
      title: 'Finalizado',
      count: false,
      route: '/pedidos/status/finalizado'
    }
  ];

  // Itens do submenu para "Automações"
  public submenuAutItems = [
    {
      icon: 'lucideFile',
      title: 'Gerar Proposta',
      route: '/proposta/gerar'
    },
    {
      icon: 'lucideFile',
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
    const user = this.authService.getUser();
    this.userCargo = user.cargo;
    this.userSetor = user.setor;
  }

  ngOnInit(): void {
    const lastSubmenu = localStorage.getItem('lastVisitedSubmenu');
    if (lastSubmenu) {
      this.activeSubmenu = lastSubmenu;
      this.showMainMenu = false;
      this.showSubmenu = true;
    }

    this.menuSections = this.menuSections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        this.userCargo === 'ADMINISTRADOR' || (
          (!item.roles || item.roles.includes(this.userCargo)) &&
          (!item.setores || item.setores.includes(this.userSetor))
        )
      )
    }))
    .filter(section => section.items.length > 0);



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

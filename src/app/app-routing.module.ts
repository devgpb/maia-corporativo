import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { ReferenciasComponent } from './referencias/referencias.component';
import { ContaComponent } from './conta/conta.component';
import { LoginComponent } from './login/login.component';
import { SetoresComponent } from './setores/setores.component';
import { NovoUserComponent } from './novo-user/novo-user.component';
import { CriarPedidoComponent } from './criar-pedido/criar-pedido.component';
import { MeusRelatoriosComponent } from './meus-relatorios/meus-relatorios.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CalendarioCorporativoComponent } from './calendario-corporativo/calendario-corporativo.component';
import { NovoEventoComponent } from './novo-evento/novo-evento.component';
import { AuthGuard } from './services/guard/auth.guard';
import { CriarContratoComponent } from './criar-contrato/criar-contrato.component';
import { CriarProcuracaoComponent } from './criar-procuracao/criar-procuracao.component';
import { EquipamentosComponent } from './equipamentos/equipamentos.component';
import { DimencionarProjetoComponent } from './dimencionar-projeto/dimencionar-projeto.component';
import { CriarPropostaComponent } from './criar-proposta/criar-proposta.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { FormulariosComponent } from './formularios/formularios.component';
import { FormPedidoComponent } from './forms/form-pedido/form-pedido.component';
import { PedidoExternoComponent } from './pedido-externo/pedido-externo.component';
import { HomologacoesComponent } from './homologacoes/homologacoes.component';
import { NovoMenuComponent } from './novo-menu/novo-menu.component';
import { ListaPedidosComponent } from './lista-pedidos/lista-pedidos.component';
import { ListaContatosComponent } from './vendas/lista-contatos/lista-contatos.component';
import { ClienteFormComponent } from './vendas/cliente-form/cliente-form.component';
import { ListaClientesComponent } from './vendas/lista-clientes/lista-clientes.component';
import { DashboardVendas } from './vendas/dashboard-vendas/dashboard-vendas.component';
import { MensagensPadraoComponent } from './vendas/mensagens-padrao/mensagens-padrao.component';

import { EventAgendaComponent } from './vendas/event-agenda/event-agenda.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },

  // { path: "pedidos", component: PedidosComponent, canActivate: [AuthGuard] },
  { path: "pedidos/status/:status", component: PedidosComponent, canActivate: [AuthGuard] },
  { path: "pedidos/detalhes/:detalhe", component: ListaPedidosComponent, canActivate: [AuthGuard] },

  { path: "conta", component: ContaComponent, canActivate: [AuthGuard] },
  { path: "conta/editar/:id", component: ContaComponent, canActivate: [AuthGuard] },
  { path: "usuarios/novo", component: NovoUserComponent, canActivate: [AuthGuard] },
  { path: "pedido/criar", component: CriarPedidoComponent, canActivate: [AuthGuard] },
  { path: "pedido/criar/externo", component: FormPedidoComponent },
  { path: "pedido/finalizar/externo", component: FormPedidoComponent },
  { path: "pedido/visualizar/externo", component: FormPedidoComponent },
  { path: "pedido/vistoria/externo", component: FormPedidoComponent },


  { path: "vendas/contatos", component: ListaContatosComponent, canActivate: [AuthGuard] },
  { path: "vendas/leads", component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: "vendas/lista/clientes", component: ListaClientesComponent, canActivate: [AuthGuard] },
  { path: "vendas/dashboard", component: DashboardVendas, canActivate: [AuthGuard] },
  { path: "vendas/meus/eventos", component: EventAgendaComponent, canActivate: [AuthGuard] },
  { path: "vendas/mensagens-padrao", component: MensagensPadraoComponent, canActivate: [AuthGuard] },







  { path: "homologacoes", component: HomologacoesComponent, canActivate: [AuthGuard] },
  { path: "menu", component: NovoMenuComponent, canActivate: [AuthGuard] },

  { path: "setores", component: SetoresComponent, canActivate: [AuthGuard] },
  { path: "relatorios/meus", component: MeusRelatoriosComponent, canActivate: [AuthGuard] },
  { path: "ref", component: ReferenciasComponent, canActivate: [AuthGuard]  },
  { path: "calendario", component: CalendarioCorporativoComponent, canActivate: [AuthGuard]  },
  { path: "eventos/novo", component: NovoEventoComponent, canActivate: [AuthGuard]  },
  { path: "contrato/gerar/:id", component: CriarContratoComponent, canActivate: [AuthGuard]  },
  { path: "procuracao/gerar", component: CriarProcuracaoComponent, canActivate: [AuthGuard]  },
  { path: "proposta/gerar", component: CriarPropostaComponent, canActivate: [AuthGuard]  },
  { path: "relatorio", component: RelatorioComponent, canActivate: [AuthGuard]  },
  { path: "formularios", component: FormulariosComponent, canActivate: [AuthGuard]  },


  { path: "equipamentos", component: EquipamentosComponent, canActivate: [AuthGuard]  },
  { path: "projetos/dimencionar", component: DimencionarProjetoComponent, canActivate: [AuthGuard]  },


  { path: '**', redirectTo: 'menu', pathMatch: 'full'  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

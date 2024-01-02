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
import { RelatorioVendasComponent } from './relatorio-vendas/relatorio-vendas.component';
import { CalendarioCorporativoComponent } from './calendario-corporativo/calendario-corporativo.component';
import { NovoEventoComponent } from './novo-evento/novo-evento.component';
import { AuthGuard } from './services/guard/auth.guard';
import { CriarContratoComponent } from './criar-contrato/criar-contrato.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },

  // { path: "pedidos", component: PedidosComponent, canActivate: [AuthGuard] },
  { path: "pedidos/:status", component: PedidosComponent, canActivate: [AuthGuard] },
  { path: "conta", component: ContaComponent, canActivate: [AuthGuard] },
  { path: "conta/editar/:id", component: ContaComponent, canActivate: [AuthGuard] },
  { path: "usuarios/novo", component: NovoUserComponent, canActivate: [AuthGuard] },
  { path: "pedido/criar", component: CriarPedidoComponent, canActivate: [AuthGuard] },
  { path: "setores", component: SetoresComponent, canActivate: [AuthGuard] },
  { path: "relatorios/meus", component: MeusRelatoriosComponent, canActivate: [AuthGuard] },
  { path: "relatoriosGerenciais/vendas", component: RelatorioVendasComponent, canActivate: [AuthGuard] },
  { path: "ref", component: ReferenciasComponent, canActivate: [AuthGuard]  },
  { path: "calendario", component: CalendarioCorporativoComponent, canActivate: [AuthGuard]  },
  { path: "eventos/novo", component: NovoEventoComponent, canActivate: [AuthGuard]  },
  { path: "contrato/gerar", component: CriarContratoComponent, canActivate: [AuthGuard]  },

  { path: '**', redirectTo: 'pedidos/prospectados', pathMatch: 'full'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

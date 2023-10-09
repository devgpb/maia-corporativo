import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { HomeComponent } from './home/home.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { ProcessoComponent } from './processo/processo.component';
import { InstalarComponent } from './instalar/instalar.component';
import { FinalizadosComponent } from './finalizados/finalizados.component';
import { ContaComponent } from './conta/conta.component';
import { LoginComponent } from './login/login.component';
import { SetoresComponent } from './setores/setores.component';
import { NovoUserComponent } from './novo-user/novo-user.component';

import { AuthGuard } from './services/guard/auth.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent },

  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "processo", component: ProcessoComponent, canActivate: [AuthGuard] },
  { path: "instalar", component: InstalarComponent, canActivate: [AuthGuard] },
  { path: "finalizados", component: FinalizadosComponent, canActivate: [AuthGuard] },
  { path: "conta", component: ContaComponent, canActivate: [AuthGuard] },
  { path: "usuarios/novo", component: NovoUserComponent, canActivate: [AuthGuard] },
  { path: "setores", component: SetoresComponent, canActivate: [AuthGuard] },
  { path: "ref", component: ReferenciasComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'home', pathMatch: 'full'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

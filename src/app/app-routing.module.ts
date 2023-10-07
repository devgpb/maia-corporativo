import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/guard/auth.guard';

const routes: Routes = [
  { path: "login", component: LoginComponent },

  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "ref", component: ReferenciasComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'login', pathMatch: 'full'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

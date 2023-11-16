import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";

import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BlockUIModule } from "ng-block-ui";
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumericOnlyDirective } from "./services/utils/numeric-only.directive";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ModalComponent } from './modal/modal.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { LoginComponent } from './login/login.component';
import { ContaComponent } from './conta/conta.component';
import { SetoresComponent } from './setores/setores.component';
import { NovoUserComponent } from './novo-user/novo-user.component';
import { CriarPedidoComponent } from './criar-pedido/criar-pedido.component';
import { MeusRelatoriosComponent } from './meus-relatorios/meus-relatorios.component';
import { PesquisaPipe } from './pipes/pesquisa/pesquisa.pipe';
import { TabelaPedidosComponent } from './tabela-pedidos/tabela-pedidos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { RelatorioVendasComponent } from './relatorio-vendas/relatorio-vendas.component';
import { VisualValidatorComponent } from './components/visual-validator/visual-validator.component';


defineLocale("pt-br", ptBrLocale);
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    ModalComponent,
    ReferenciasComponent,
    LoginComponent,
    ContaComponent,
    SetoresComponent,
    NovoUserComponent,
    CriarPedidoComponent,
    MeusRelatoriosComponent,
    PesquisaPipe,
    TabelaPedidosComponent,
    PedidosComponent,
    RelatorioVendasComponent,
    VisualValidatorComponent,
    NumericOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BlockUIModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
		DataTablesModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";

import { NgModule,LOCALE_ID, isDevMode } from '@angular/core';
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
import { FullCalendarModule } from '@fullcalendar/angular';
import { DatePipe } from "@angular/common";
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { CommonModule } from "@angular/common";
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
import { PedidosComponent } from './pedidos/pedidos.component';
import { VisualValidatorComponent } from './components/visual-validator/visual-validator.component';
import { CalendarioCorporativoComponent } from './calendario-corporativo/calendario-corporativo.component';
import { NovoEventoComponent } from './novo-evento/novo-evento.component';
import { PorcentagemDisplayComponent } from './components/porcentagem-display/porcentagem-display.component';
import { CriarContratoComponent } from './criar-contrato/criar-contrato.component';
import { EquipamentosComponent } from './equipamentos/equipamentos.component';
import { DimencionarProjetoComponent } from './dimencionar-projeto/dimencionar-projeto.component';
import { DisplayPedidosComponent } from './display-pedidos/display-pedidos.component';
import { EditComponent } from './display-pedidos/edit/edit.component';
import { DatasComponent } from './display-pedidos/datas/datas.component';
import { CriarProcuracaoComponent } from './criar-procuracao/criar-procuracao.component';
import { CriarPropostaComponent } from './criar-proposta/criar-proposta.component';
import { TruncatePipe } from './pipes/truncate/truncate.pipe';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { PesquisaRelatorioComponent } from './relatorio/pesquisa-relatorio/pesquisa-relatorio.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { KitsSolaresComponent } from './equipamentos/kits-solares/kits-solares.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    PedidosComponent,
    VisualValidatorComponent,
    NumericOnlyDirective,
    CalendarioCorporativoComponent,
    NovoEventoComponent,
    PorcentagemDisplayComponent,
    CriarContratoComponent,
    EquipamentosComponent,
    DimencionarProjetoComponent,
    DisplayPedidosComponent,
    EditComponent,
    DatasComponent,
    CriarProcuracaoComponent,
    CriarPropostaComponent,
    TruncatePipe,
    RelatorioComponent,
    PesquisaRelatorioComponent,
    FormGeneratorComponent,
    KitsSolaresComponent,
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
		NgMultiSelectDropDownModule.forRoot(),
    FullCalendarModule,
    CurrencyMaskModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

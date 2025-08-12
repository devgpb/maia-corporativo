import { registerLocaleData, } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";

import { NgModule,LOCALE_ID, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BlockUIModule } from "ng-block-ui";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { NumericOnlyDirective } from "./services/utils/numeric-only.directive";
import { FullCalendarModule } from '@fullcalendar/angular';
import { DatePipe } from "@angular/common";
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgApexchartsModule } from 'ng-apexcharts';

import { NgIconsModule } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';


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
import { FormulariosComponent } from './formularios/formularios.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MaskDirective } from './directives/mask.directive';
import { FormPedidoComponent } from './forms/form-pedido/form-pedido.component';
import { FormFinalPedidoComponent } from './forms/form-final-pedido/form-final-pedido.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { QrCodeModalComponent } from './components/qr-code-modal/qr-code-modal.component';
import { PedidoExternoComponent } from './pedido-externo/pedido-externo.component';
import { VistoIncialComponent } from './forms/visto-incial/visto-incial.component';
import { HomologacoesComponent } from './homologacoes/homologacoes.component';
import { NovoMenuComponent } from './novo-menu/novo-menu.component';
import { CardClienteComponent } from './components/card-cliente/card-cliente.component';
import { ListaPedidosComponent } from './lista-pedidos/lista-pedidos.component';
import { ListaContatosComponent } from './vendas/lista-contatos/lista-contatos.component';
import { CardContatoComponent } from './vendas/lista-contatos/card-contato/card-contato.component';
import { ClienteFormComponent } from "./vendas/cliente-form/cliente-form.component";
import { ListaClientesComponent } from "./vendas/lista-clientes/lista-clientes.component";
import { ClienteCardComponent } from "./vendas/lista-clientes/cliente-card/cliente-card.component";
import { ClienteModalComponent } from "./vendas/cliente-modal/cliente-modal.component";
import { DashboardVendas } from "./vendas/dashboard-vendas/dashboard-vendas.component";

defineLocale("pt-br", ptBrLocale);
registerLocaleData(localePt);

@NgModule({ declarations: [
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
        FormulariosComponent,
        FileUploadComponent,
        MaskDirective,
        FormPedidoComponent,
        FormFinalPedidoComponent,
        QrCodeModalComponent,
        PedidoExternoComponent,
        VistoIncialComponent,
        HomologacoesComponent,
        NovoMenuComponent,
        CardClienteComponent,
        ListaPedidosComponent,
        ListaContatosComponent,
        CardContatoComponent,
        ClienteFormComponent,
        ListaClientesComponent,
        ClienteCardComponent,
        ClienteModalComponent,
        DashboardVendas
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        NgIconsModule.withIcons(lucideIcons),
        AppRoutingModule,
        BlockUIModule,
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
        NgApexchartsModule,

      ], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }, DatePipe,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
  constructor(private config: NgSelectConfig) {
    this.config.addTagText = 'Adicionar';
    this.config.notFoundText = 'Nenhum resultado encontrado';
    this.config.clearAllText = 'Limpar tudo';
  }
 }

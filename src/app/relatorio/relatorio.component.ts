import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RelatoriosGerenciaisService } from '../services/relatorios-gerenciais/relatorios-gerenciais.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as Constantes from "../constants";
import { Cargos, IUser } from '../interfaces/IUser';
import { AuthService } from '../services/auth/auth.service';
import { IPedido } from '../interfaces/IPedido';
import { ModalService } from '../services/modal/modal.service';
import Swal from 'sweetalert2';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { IConfigExcel } from '../interfaces/IConfigExcel';


@Component({
    selector: 'app-relatorio',
    templateUrl: './relatorio.component.html',
    styleUrls: ['./relatorio.component.scss'],
    standalone: false
})
export class RelatorioComponent implements OnInit {
  public pedidosList = [];
  @ViewChild("pedidos", { read: DataTableDirective, static: true })

	private dataTablePedidos: DataTableDirective;
	public dtOptionsPedidos: DataTables.Settings;
  public dtTriggerPedidos: Subject<any> = new Subject<any>();
  public filtros: any
  public loading: boolean = false
  public showEdit: boolean = false
  public pedido: IPedido
  public rotaEspecial = false
  public user: IUser;
  public isAdm: boolean;

  constructor(
    private relatoriosGerenciaisService: RelatoriosGerenciaisService,
    private authService: AuthService,
    private modalService: ModalService,
    private pedidosService: PedidosService

  ) {
    this.user = this.authService.getUser()
    this.isAdm = this.user.cargo == Cargos.ADMINISTRADOR
  }

  ngOnInit(): void {
    // this.pedidosList = [
    //   {
    //     nomeCompleto: 'Fulano de Tal',
    //     referencia: 'Próximo ao mercado',
    //     observacao: 'Sem cebola',
    //     formaPagamento: 'Dinheiro',
    //     data: '01/01/2021',
    //     status: 'Entregue'
    //   },
    //   {
    //     nomeCompleto: 'Ciclano de Tal',
    //     referencia: 'Próximo ao mercado',
    //     observacao: 'Sem cebola',
    //     formaPagamento: 'Cartão',
    //     data: '02/02/2021',
    //     status: 'Entregue'
    //   }
    // ];

    this.dtOptionsPedidos = {
      language: Constantes.dtlanguage,
      responsive: true,
			// stateSave: true,
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      // ordering: true,
      order: [[6, 'desc']],
      // columnDefs: [
      //   { targets: [0, 1, 5, 6], orderable: false },
      //   { targets: [6], visible: false },
      //   { targets: [0, 1, 2, 3, 4, 5, 6], defaultContent: ''},
      // ],
		};
  }

  getPedidos(): void {
    this.loading = true
    this.relatoriosGerenciaisService.getRelatorioPedidos(this.filtros).subscribe((response) => {
      this.pedidosList = response;
      this.loading = false
      this.rerender();
    });
  }


  pesquisarPedidos(filtros: any): void {
    this.filtros = filtros;
    this.getPedidos();
  }


  // DT
  ngOnDestroy(): void {
    this.dtTriggerPedidos.unsubscribe();
  }

  rerender(): void {
    if (this.dataTablePedidos?.dtInstance) {
      this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
      this.dtTriggerPedidos.next(null);
    }else{
      this.dtTriggerPedidos.next(null);
    }
  }


  carregarTabela(){
    this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.loading = true
      this.relatoriosGerenciaisService.getRelatorioPedidos(this.filtros).subscribe((response) => {
        this.pedidosList = response;
        this.loading = false
        this.dtTriggerPedidos.next(null);
      });
    });
  }

  get podeEditar(){
    if(this.isAdm || this.user.cargo == Cargos.GESTOR) return true
    // if([0,1,2].includes(this.indicePagina)) return true

    return false
  }

  toggleModal() {
    this.modalService.toggle();
  }

  abrirEdicao(pedido: IPedido){
    this.showEdit = true
    this.pedido = pedido;
    this.toggleModal()
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  refazerTabela(){
    this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getPedidos()
    });
  }

  baixarListaPedidos(){
    const daterangeBr = this.filtros.rangeDatas.map(date => date.toLocaleDateString('pt-BR'));
    const stringDaterange = daterangeBr.join(' e ');

    const config: IConfigExcel = {
      dados: this.pedidosList,
      titulo: 'Relatório Gerencial de Pedidos Engemaia',
      descricao: 'Lista de pedidos entre ' + stringDaterange,
      chaves: [
        { key: 'idPedido', name: 'ID' },
        { key: 'nomeCompleto', name: 'Cliente' },
        { key: 'dataPedido', name: 'Data' },
        { key: 'faturamento', name: 'Valor Total', tipo: 'money' },
        { key: 'formaPagamento', name: 'Forma de Pagamento' },
        { key: 'documentacaoGerada', name: 'Documentação' },


        { key: 'status', name: 'Status' },
        { key: 'observacao', name: 'Observação' },
      ]
    };

    this.pedidosService.baixarListaPedidos(config).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Lista_de_Pedidos.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error => {
        console.error('Erro ao baixar a lista de pedidos', error);
        // Logar error com swal
        Swal.fire({
          icon: 'error',
          title: 'Erro ao baixar a lista de pedidos',
          text: 'Por favor, contacte o suporte.'
        });
      }
    );
  }
}

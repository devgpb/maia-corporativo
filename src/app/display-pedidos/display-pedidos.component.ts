import { Component, Input, Output, EventEmitter,  SimpleChanges, OnChanges, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { DataTableDirective } from 'angular-datatables';
import { BehaviorSubject, Subject, Subscription, delay, timeInterval, timer } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import * as Constantes from "../constants";
import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';
import { Cargos, IUser } from '../interfaces/IUser';
import { ptBrLocale } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ModalService } from '../services/modal/modal.service';
import tippy from 'tippy.js';
import { todasRotas } from '../constants';
import { StorageService } from '../services/storage/storage.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { IConfigExcel } from '../interfaces/IConfigExcel';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-display-pedidos',
  templateUrl: './display-pedidos.component.html',
  styleUrls: ['./display-pedidos.component.scss']
})

export class DisplayPedidosComponent implements OnInit, OnChanges, AfterViewInit{
  listaPedidos: IPedido[] = new Array<IPedido>;

  @Input() status: string = '';
  @Input() rotaEspecial: boolean = false;
  @ViewChild("pedidos", { read: DataTableDirective, static: true })

	private dataTablePedidos: DataTableDirective;
	public dtOptionsPedidos: DataTables.Settings;
  public dtTriggerPedidos: Subject<any> = new Subject<any>();
  public user: IUser;
  public isAdm: boolean;
  public showEdit: boolean;
  public loading: boolean;
  public canAvancar: boolean = true;
  public canRetroceder:boolean = true;
  public allSelected: boolean = false;
  public indicePagina: number;
  public totalPaginas: number;
  public listaPedidosId: Array<number | string> = []
  public pedido: IPedido
  public rotas = todasRotas;
  public statusSelecionado: string;
  private socketSub: Subscription;



  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private pedidosService: PedidosService,
    private storageService: StorageService,
    private webSocketService: WebSocketService,

  ){
    this.user = this.authService.getUser()
    this.isAdm = this.user.cargo == Cargos.ADMINISTRADOR
  }

  ngOnInit(){
    this.dtOptionsPedidos = {
      language: Constantes.dtlanguage,
      responsive: true,
			// stateSave: true,
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true,
      // ordering: true,
      order: [[7, 'desc']],
      columnDefs: [
        { targets: [0, 1, 5, 6], orderable: false },
        { targets: [7], visible: false },
        { targets: [0, 1, 2, 3, 4, 5, 6, 7], defaultContent: ''},
      ],
		};
    this.getPedidos()
    this.listenForNotifications()
  }

  private listenForNotifications() {
    this.socketSub = this.webSocketService.getNovoPedido().subscribe((pedido: any) => {
      this.carregarTabela()
    });
  }

  ngAfterViewInit(): void {
    tippy('.tippy-obs', {
      placement: 'top',
      allowHTML: true,
      delay: [0, 0]
    });
  }

  getPedidos(){
    this.loading = true
    this.listaPedidos = []
    const idOrUndefined = this.isAdm ? undefined : this.user.idUsuario
    this.pedidosService.getPedidosByStatus(this.status,idOrUndefined, this.user.cargo).subscribe(pedidos =>{
      this.indicePagina = Constantes.rotasPedidos.indexOf(this.status)
      this.totalPaginas = Constantes.rotasPedidos.length;
      this.canRetroceder = this.indicePagina !== 0
      this.canAvancar = this.indicePagina !== this.totalPaginas  - 1
      this.listaPedidos = pedidos
      this.loading = false
      this.dtTriggerPedidos.next(null);
    })
  }

  rerender(): void {
    this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTriggerPedidos.next(null);
    });
  }

  carregarTabela(){
    this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getPedidos()
    });
  }


  avancarPedido(pedido: IPedido){
    this.pedidosService.avancarPedido(pedido.idPedido).subscribe(avancado =>{
      if(avancado){
        this.carregarTabela()
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedido Não Avançado!",
        });
      }
    })
  }

  handleMultiplosPedidos(action: string, isStatus: boolean = undefined){

    const status = isStatus ? this.statusSelecionado : undefined
    console.log(status)
    this.pedidosService.handleMultiplePedidos(this.listaPedidosId, action, status).subscribe(checker =>{
      if(checker){
        Swal.fire({
          icon: "success",
          title: "Pedidos Atualizados!",
          confirmButtonColor: "#3C58BF"
        });
        this.carregarTabela()
        this.listaPedidosId = [];
        this.statusSelecionado = undefined
      }else{
        Swal.fire({
          icon: "error",
          title: "Operação Não Realizada, Favor Contatar Suporte!",
        });
      }
    })
  }

  retrocederPedido(pedido: IPedido){
    this.pedidosService.retrocederPedido(pedido.idPedido).subscribe(avancado =>{
      if(avancado){
        this.carregarTabela()
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedido Não Retrocedido!",
        });
      }
    })
  }

  deletarPedido(pedido: IPedido){

    Swal.fire({
      title: 'Deseja mesmo apagar o pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.deletePedidos(pedido.idPedido as string).subscribe(apagado =>{
          if(apagado){
            Swal.fire({
              icon: "success",
              title: "Pedido Apagado!",
              confirmButtonColor: "#3C58BF"
            });
            this.carregarTabela()
          }else{
            Swal.fire({
              icon: "error",
              title: "Pedido Não Apagado!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Pedido não foi apagado.', '', 'info');
      }
    });
  }

  liberarPedido(pedido: IPedido){
    if(this.status == 'standby')
      this.pedidosService.removerStandby(pedido.idPedido).subscribe(checker => {
        if(checker){
          Swal.fire({
            icon: "success",
            title: "Pedido Retornado a  "+checker.toUpperCase()+"  !",
            confirmButtonColor: "#3C58BF"
          });
          this.carregarTabela()
        }else{
          Swal.fire({
            icon: "error",
            title: "Operação Não Realizada, Favor Contatar Suporte!",
          });
        }
      })

      if(this.status == 'perdidos')
      this.pedidosService.removerPerdido(pedido.idPedido).subscribe(checker => {
        if(checker){

          Swal.fire({
            icon: "success",
            title: "Pedido Retornado a  "+checker.toUpperCase()+"  !",
            confirmButtonColor: "#3C58BF"
          });
          this.carregarTabela()
        }else{
          Swal.fire({
            icon: "error",
            title: "Operação Não Realizada, Favor Contatar Suporte!",
          });
        }
      })
  }

  abrirEdicao(pedido: IPedido){
    this.showEdit = true
    this.pedido = pedido;
    this.toggleModal()
  }

  atualizarSelecionados(pedido: IPedido): void {
    if (pedido.selected) {
        if (!this.listaPedidosId.includes(pedido.idPedido)) {
            this.listaPedidosId.push(pedido.idPedido);
        }
    } else {
        this.listaPedidosId = this.listaPedidosId.filter(id => id !== pedido.idPedido);
    }
  }

  selecionarTodos(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.listaPedidos.forEach(pedido => {
      pedido.selected = isChecked
      if (isChecked) {
        if (!this.listaPedidosId.includes(pedido.idPedido)) {
          this.listaPedidosId.push(pedido.idPedido);
        }
      } else {
        this.listaPedidosId = [];
      }
    });
  }



  //  UTILS
  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return data.toLocaleDateString('pt-BR', options);
  }

  refazerTabela(){
    this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getPedidos()
    });
  }

  apagarTabela(){
    if (this.dataTablePedidos?.dtInstance) {
      this.dataTablePedidos.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
      });
      this.dtTriggerPedidos.complete();
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['status'] && changes['status'].currentValue != 'criar') {
      this.refazerTabela()
      this.allSelected = false
      this.listaPedidosId = [];
    }
  }

  ngOnDestroy(): void {
  }

  toggleModal() {
    this.modalService.toggle();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  salvarPedidoStorage(pedido: IPedido){
    this.storageService.setItem('pedido', JSON.stringify(pedido))
  }

  baixarListaPedidos(){
    const config: IConfigExcel = {
      dados: this.listaPedidos,
      titulo: 'Relatório de Pedidos Engemaia - ' + new Date().toLocaleDateString().replace(/\//g, '-'),
      descricao: 'Lista de pedidos em status ' + this.status,
      chaves: [
        { key: 'idPedido', name: 'ID' },
        { key: 'nomeCompleto', name: 'Cliente' },
        { key: 'dataPedido', name: 'Data do Pedido' },
        { key: 'faturamento', name: 'Total', tipo: 'money' },
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

  get podeEditar(){
    if(this.isAdm || this.user.cargo == Cargos.GESTOR) return true
    // if([0,1,2].includes(this.indicePagina)) return true

    return false
  }
}

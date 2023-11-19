import { Component, Input, Output, EventEmitter,  SimpleChanges, OnChanges } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import * as Constantes from "../constants";
import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';
import { Cargos, IUser } from '../interfaces/IUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tabela-pedidos',
  templateUrl: './tabela-pedidos.component.html',
  styleUrls: ['./tabela-pedidos.component.scss']
})
export class TabelaPedidosComponent implements OnChanges  {
  public isAdm = false;
  public user: IUser;
  public showDetails = true;
  public showEdit = false;
  public pedidoEmEdicao: any;
  public canAvancar: boolean = true;
  public canRetroceder:boolean = true;
  public editForm: FormGroup;
  public titulo: string = "";
  public textoApoio: string = "";


  public indicePagina: number = 0;
  public totalPaginas: number = 0;

  public indiceDetalhe: number = 0;
  public indiceLimiteDetalhe: number = 0;


  audio = new Audio();
  list: IPedido[] = [];
  @Input() status: string = '';
  @Input() rotaEspecial: boolean = false;


  public pageSize: number = 10; // Quantidade de itens por página
  public currentPage: number = 1; // Página atual
  public totalItems: number = 0; // Total de itens
  searchText: string = '';


  constructor(
    private pedidosService:PedidosService,
    private webSocketService:WebSocketService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.user = authService.getUser()
    this.detalhes = {}
    this.editForm = this.initializeForm();
    this.editForm.get('ref')?.disable();
    this.editForm.get('status')?.disable();
    this.audio.src = '../../assets/audio/tem_um_novo_pedido.mp3';
    this.audio.load();
  }

  detalhes: IPedido | any;


  initializeForm() {
    // Inicialização do formulário
    return this.fb.group({
      nomeCompleto: ['', Validators.required],
      celular: ['', Validators.required],
      email: [''],
      cidade: [''],
      rua: [''],
      cep: [''],
      status: ['', Validators.required],
      consumoDeEnergiaMensal: [''],
      faturamento: [0],
      dataPedido: ['', Validators.required],
      observacao: [''],
      detalhes: [{}],
      ref: [''],
      responsavel: ['']
    });
  }

  public reloadDisplay(){
    this.titulo = Constantes.titulos[this.status]
    this.textoApoio = Constantes.descricoesStatus[this.status]

    this.totalPaginas = Constantes.rotasPedidos.length;
    this.indicePagina = Constantes.rotasPedidos.indexOf(this.status)
    this.canRetroceder = this.indicePagina !== 0
    this.canAvancar = this.indicePagina !== this.totalPaginas  - 1
  }

  ngOnInit(): void {
    this.isAdm = this.user.cargo == Cargos.ADMINISTRADOR
    this.reloadDisplay();
    this.atualizarPedidos()
  }

  podeEditar(){
    if(this.isAdm) return true

    if([0,1,2].includes(this.indicePagina)) return true

    return false
  }

  ngOnChanges(changes: SimpleChanges) {
    // Verifique se a propriedade status foi alterada
    if (changes['status'] && changes['status'].currentValue !== changes['status'].previousValue) {
      // Chame a função de atualização de pedidos com o novo status
      this.reloadDisplay();
      this.atualizarPedidos();
    }
  }

  atualizarPedidos(){
    this.pedidosService.getPedidosByStatus(this.status,this.isAdm ? undefined : this.user.idUsuario ).subscribe(pedidos =>{
      this.list = pedidos
    })
  }

  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return data.toLocaleDateString('pt-BR', options);
  }

  get paginatedList(): IPedido[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.list.slice(startIndex, startIndex + this.pageSize);
  }

  public getTotalPages(): number {
    return Math.ceil(this.list.length / this.pageSize);
  }

  public changePageSize(): void {
    this.currentPage = 1; // Resetar para a primeira página ao mudar o tamanho da página
  }

  public getPagesArray(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  public changePage(page: number): void {
    this.currentPage = page;
  }

  public avancarPagina(){
    const indexAtual = Constantes.rotasPedidos.indexOf(this.status) + 1;
    const index = indexAtual > this.totalPaginas -1 ? 0 : indexAtual
    const pagina = Constantes.rotasPedidos[index]
    this.router.navigate(['/pedidos/'+ pagina]);
  }

  public voltarPagina(){
    const indexAtual = Constantes.rotasPedidos.indexOf(this.status) - 1;
    const index = indexAtual < 0 ? this.totalPaginas - 1 : indexAtual
    const pagina = Constantes.rotasPedidos[index]

    this.router.navigate(['/pedidos/'+ pagina]);
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  formatLabel(label: string) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  abrirDetalhes(pedido: IPedido){
    this.showEdit = false
    this.showDetails = true
    this.indiceDetalhe = this.list.indexOf(pedido)
    this.indiceLimiteDetalhe = this.list.length
    this.detalhes = pedido;

    this.openModal()
  }

  voltarPedido(pedido: IPedido, edit = false){
    const indexAntigo = this.list.indexOf(pedido)
    this.detalhes = this.list[indexAntigo - 1]
    this.indiceDetalhe = indexAntigo - 1

    if(edit){
      this.showDetails = false
      this.showEdit = true
      this.gerarFormEdicao(this.detalhes)
    }

  }

  proximoPedido(pedido: IPedido, edit = false){
    const indexAntigo = this.list.indexOf(pedido)
    this.detalhes = this.list[indexAntigo + 1]
    this.indiceDetalhe = indexAntigo + 1



    if(edit){
      this.showDetails = false
      this.showEdit = true
      this.gerarFormEdicao(this.detalhes)
    }

  }

  gerarFormEdicao( pedido:IPedido ){
    const data = new Date(pedido.dataPedido).toISOString().split('T')[0]

    this.editForm.patchValue({
      nomeCompleto: pedido.nomeCompleto,
      celular: pedido.celular,
      email: pedido.email,
      cidade: pedido.cidade,
      rua: pedido.rua,
      cep: pedido.cep,
      status: pedido.status,
      consumoDeEnergiaMensal: pedido.consumoDeEnergiaMensal,
      faturamento: pedido.faturamento,
      dataPedido: data,
      ref: pedido.ref,
      responsavel: pedido.responsavel,
      observacao:pedido.observacao,
      detalhes: pedido.detalhes
    });

    this.pedidoEmEdicao = pedido
  }

  abrirEdicao(pedido: IPedido){
    this.showDetails = false
    this.showEdit = true

    this.indiceDetalhe = this.list.indexOf(pedido)
    this.indiceLimiteDetalhe = this.list.length

    this.gerarFormEdicao(pedido)

    this.detalhes = pedido;
    this.openModal()
  }

  toggleDetalhe(detalhe: string){
    const detalhesAtualizados = {
      ...this.editForm.value.detalhes, // copia todas as propriedades existentes
      [detalhe]: !this.editForm.value.detalhes[detalhe] // sobrescreve apenas a propriedade específica
    };

    this.editForm.patchValue({
      detalhes: detalhesAtualizados
    });

  }

  nothingChanged(): boolean {
    const formValues = this.editForm.value;

    return formValues.nomeCompleto === this.pedidoEmEdicao.nomeCompleto &&
           formValues.celular === this.pedidoEmEdicao.celular &&
           formValues.email === this.pedidoEmEdicao.email &&
           formValues.cidade === this.pedidoEmEdicao.cidade &&
           formValues.rua === this.pedidoEmEdicao.rua &&
           formValues.cep === this.pedidoEmEdicao.cep &&
           formValues.consumoDeEnergiaMensal === this.pedidoEmEdicao.consumoDeEnergiaMensal &&
           formValues.faturamento === this.pedidoEmEdicao.faturamento &&
           formValues.dataPedido === new Date(this.pedidoEmEdicao.dataPedido).toISOString().split('T')[0] &&
           formValues.responsavel === this.pedidoEmEdicao.responsavel &&
           formValues.observacao === this.pedidoEmEdicao.observacao &&
           formValues.detalhes.trafegoPago === this.pedidoEmEdicao.detalhes.trafegoPago &&
           formValues.detalhes.orcamentoGerado === this.pedidoEmEdicao.detalhes.orcamentoGerado &&
           formValues.detalhes.vendaEngatilhada === this.pedidoEmEdicao.detalhes.vendaEngatilhada &&
           formValues.detalhes.visitaRealizada === this.pedidoEmEdicao.detalhes.visitaRealizada &&
           formValues.detalhes.semResposta === this.pedidoEmEdicao.detalhes.semResposta;


  }

  avancarPedido(pedido: IPedido){
    this.pedidosService.avancarPedido(pedido.idPedido).subscribe(avancado =>{
      if(avancado){
        Swal.fire({
          icon: "success",
          title: "Pedido Avançado!",
          confirmButtonColor: "#3C58BF"
        });
        this.reloadDisplay();
        this.atualizarPedidos();
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedido Não Avançado!",
        });
      }
    })
  }

  retrocederPedido(pedido: IPedido){
    Swal.fire({
      title: 'Deseja mesmo retroceder o pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.retrocederPedido(pedido.idPedido).subscribe(avancado =>{
          if(avancado){
            Swal.fire({
              icon: "success",
              title: "Pedido Retrocedido!",
              confirmButtonColor: "#3C58BF"
            });
            this.reloadDisplay();
            this.atualizarPedidos();
          }else{
            Swal.fire({
              icon: "error",
              title: "Pedido Não Retrocedido!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Pedido não foi retrocedido.', '', 'info');
      }
    });
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
            this.reloadDisplay();
            this.atualizarPedidos();
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

  openModal() {
    this.modalService.show();
  }

  closeModal() {
    this.modalService.hide();
  }

  marcarStandby(){
    this.pedidosService.marcarStandby(this.pedidoEmEdicao.idPedido).subscribe(pedido => {
      console.log(pedido)
      if(pedido){
        Swal.fire({
          icon: "success",
          title: "Pedido Em StandBy!",
          confirmButtonColor: "#3C58BF"
        });
        this.reloadDisplay();
        this.atualizarPedidos();
      }else{
        Swal.fire({
          icon: "error",
          title: "Operação Não Realizada, Favor Contatar Suporte!",
        });
      }
    })
  }

  marcarPerdido(){
    this.pedidosService.marcarPerdido(this.pedidoEmEdicao.idPedido).subscribe(pedido => {
      if(pedido){
        Swal.fire({
          icon: "success",
          title: "Pedido Em Perdidos!",
          confirmButtonColor: "#3C58BF"
        });
        this.reloadDisplay();
        this.atualizarPedidos();
      }else{
        Swal.fire({
          icon: "error",
          title: "Operação Não Realizada, Favor Contatar Suporte!",
        });
      }
    })
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
          this.reloadDisplay();
          this.atualizarPedidos();
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
          this.reloadDisplay();
          this.atualizarPedidos();
        }else{
          Swal.fire({
            icon: "error",
            title: "Operação Não Realizada, Favor Contatar Suporte!",
          });
        }
      })
  }

  onSubmit() {
    if (this.editForm.valid) {

      if(this.editForm.value.faturamento <= 0){
        this.editForm.value.faturamento = null
      }

      this.pedidosService.updatePedido(this.pedidoEmEdicao.idPedido,this.editForm.value).subscribe(resp =>{
        this.atualizarPedidos()
      })
      this.closeModal()
    } else {
      console.log('cep é inválido devido a:', this.editForm.get('cep')?.errors);
    }
  }
}

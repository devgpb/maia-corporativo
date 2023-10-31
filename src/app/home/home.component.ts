import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';
import { AuthService } from '../services/auth/auth.service';
import { Cargos } from '../interfaces/IUser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../interfaces/IUser';

import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {

  public isAdm = false;
  public user: IUser;
  public showDetails = true;
  public showEdit = false;
  public pedidoEmEdicao: any;
  list: IPedido[] = [];
  public editForm: FormGroup;
  audio = new Audio();

  public pageSize: number = 20; // Quantidade de itens por página
  public currentPage: number = 1; // Página atual
  public totalItems: number = 0; // Total de itens
  searchText: string = '';

  constructor(
    private pedidosService:PedidosService,
    private webSocketService:WebSocketService,
    private modalService: ModalService,
    private authService: AuthService,
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
      email: ['', [Validators.required, Validators.email]],
      cidade: ['', Validators.required],
      rua: ['', Validators.required],
      cep: ['', Validators.required],
      status: ['', Validators.required],
      consumoDeEnergiaMensal: ['', Validators.required],
      dataPedido: ['', Validators.required],
      observacao: [''],
      ref: [''],
      responsavel: ['']
    });
  }

  ngOnInit(): void {
    this.isAdm = this.user.cargo == Cargos.ADMINISTRADOR

    this.atualizarPedidos()

  }

  atualizarPedidos(){
    this.pedidosService.getPedidos(this.isAdm ? undefined : this.user.idUsuario ).subscribe(pedidos =>{
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

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  formatLabel(label: string) {
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  abrirDetalhes(pedido: IPedido){
    this.showEdit = false
    this.showDetails = true
    this.detalhes = pedido;
    this.openModal()
  }

  abrirEdicao(pedido: IPedido){
    this.showDetails = false
    this.showEdit = true
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
      dataPedido: data,
      ref: pedido.ref,
      responsavel: pedido.responsavel,
      observacao:pedido.observacao
    });

    this.pedidoEmEdicao = pedido
    this.detalhes = pedido;
    this.openModal()
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
           formValues.dataPedido === new Date(this.pedidoEmEdicao.dataPedido).toISOString().split('T')[0] &&
           formValues.responsavel === this.pedidoEmEdicao.responsavel &&
           formValues.observacao === this.pedidoEmEdicao.observacao;

  }

  avancarPedido(pedido: IPedido){
    this.pedidosService.avancarPedido(pedido.idPedido).subscribe(avancado =>{
      if(avancado){
        Swal.fire({
          icon: "success",
          title: "Pedido Avançado!",
          confirmButtonColor: "#3C58BF"
        });
        const index = this.list.indexOf(pedido);
        this.list.splice(index,1)
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
            const index = this.list.indexOf(pedido);
            this.list.splice(index,1)
          }else{
            Swal.fire({
              icon: "error",
              title: "Pedido Não Retrocedido!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Pedido não foi apagado.', '', 'info');
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
            const index = this.list.indexOf(pedido);
            this.list.splice(index,1)
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

  onSubmit() {
    if (this.editForm.valid) {

      this.pedidosService.updatePedido(this.pedidoEmEdicao.idPedido,this.editForm.value).subscribe(resp =>{
        this.atualizarPedidos()
      })
      this.closeModal()
    } else {
      console.log('cep é inválido devido a:', this.editForm.get('cep')?.errors);
    }
  }
}

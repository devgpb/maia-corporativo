import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { WebSocketService } from '../services/WebSocket/web-socket.service';
import { ModalService } from '../services/modal/modal.service';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IPedido } from '../interfaces/IPedido';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {

  public showDetails = true;
  public showEdit = false;
  // public idPedido: any = ''
  public pedidoEmEdicao: any;
  list: IPedido[] = [];
  public editForm: FormGroup;
  audio = new Audio();


  constructor(
    private pedidosService:PedidosService,
    private webSocketService:WebSocketService,
    private modalService: ModalService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
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
      ref: [''],
      responsavel: ['']
    });
  }

  ngOnInit(): void {

    this.atualizarPedidos()

    this.webSocketService.getNovoPedido().subscribe((novoPedido: IPedido) => {
      this.list.push(novoPedido);
      this.audio.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
      });
    });
  }

  atualizarPedidos(){
    this.pedidosService.getPedidos().subscribe(pedidos =>{
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
    console.log('foi')
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
      responsavel: pedido.responsavel
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
           formValues.responsavel === this.pedidoEmEdicao.responsavel;
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

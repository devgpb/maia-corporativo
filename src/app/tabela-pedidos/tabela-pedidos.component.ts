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
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { formatDate } from '@angular/common';
import * as moment from 'moment-timezone';

defineLocale('pt-br', ptBrLocale);

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
  public loading: boolean = true;

  orderDirection: string = 'asc'; // Direção da ordenação
  criterioOrdenacao: string = ""

  public indicePagina: number = 0;
  public totalPaginas: number = 0;

  public indiceDetalhe: number = 0;
  public indiceLimiteDetalhe: number = 0;

  // Marcação de datas
	public bsConfig: Partial<BsDatepickerConfig>;

  public listaPedidosId = []

  list: IPedido[] = [];
  @Input() status: string = '';
  @Input() rotaEspecial: boolean = false;


  public pageSize: number = 10; // Quantidade de itens por página
  public currentPage: number = 1; // Página atual
  public totalItems: number = 0; // Total de itens
  searchText: string = '';
  public userCargo = "";


  constructor(
    private pedidosService:PedidosService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private localeService: BsLocaleService
  ) {
    this.user = authService.getUser()
    this.userCargo = this.user.cargo
    this.detalhes = {}
    this.editForm = this.initializeForm();
    this.editForm.get('ref')?.disable();
    this.editForm.get('status')?.disable();
    // this.audio.src = '../../assets/audio/tem_um_novo_pedido.mp3';
    // this.audio.load();
    this.localeService.use('pt-br');

    this.bsConfig = {
      containerClass: 'theme-default',
    };
  }

  detalhes: IPedido | any;

  initializeForm() {
    // Inicialização do formulário
    return this.fb.group({
      nomeCompleto: ['', Validators.required],
      celular: ['', [Validators.required, Validators.minLength(12)]],
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
      indicacao: [''],
      datas: this.fb.group({
        dataVisita: this.fb.group({
          data: [''],
          hora: [0],
          minuto: [0]
        }),
        dataInstalacao: this.fb.group({
          data: [''],
          hora: [0],
          minuto: [0]
        }),
      }),
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
    this.isAdm = this.user.cargo == Cargos.ADMINISTRADOR;this.user.cargo == Cargos.ADMINISTRADOR
    this.listaPedidosId = [];
    this.atualizarPedidos();
    this.reloadDisplay();
  }

  get podeEditar(){
    if(this.isAdm) return true

    if([0,1,2].includes(this.indicePagina)) return true

    return false
  }

  applyCelularMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o celular
    value = value.substring(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
    event.target.value = value;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Verifique se a propriedade status foi alterada
    if (changes['status'] && changes['status'].currentValue !== changes['status'].previousValue) {
      // Chame a função de atualização de pedidos com o novo status
      this.listaPedidosId = [];
      this.reloadDisplay();
      this.atualizarPedidos();
    }
  }

  atualizarPedidos(){
    this.loading = true

    this.pedidosService.getPedidosByStatus(this.status,this.isAdm ? undefined : this.user.idUsuario ).subscribe(pedidos =>{
      this.list = pedidos
      this.loading = false
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

  formatarDataEvento(dataString: any ) {
    console.log(dataString.data)
    if(dataString.data == null || dataString.data == undefined){
      return null
    }

    // if(typeof dataString.data == 'string'){
    //   return dataString
    // }


    const dataEventos = new Date(dataString.data)
    dataEventos.setHours(dataString.hora, dataString.minuto, 0);

    dataString.data = dataEventos

    return dataString.data;
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

  convertUTCtoLocal = (dateString: string, timeZone: string) => {
    if(dateString == null){
      return null
    }
    try{
      return moment(dateString).tz(timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS');
    }catch(e){
      return null
    }
  };

  gerarFormEdicao( pedido:IPedido ){
    const data = new Date(pedido.dataPedido).toISOString().split('T')[0]

    // const dataPedido =
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
      indicacao: pedido.indicacao,
      observacao:pedido.observacao,
      detalhes: pedido.detalhes,
      datas:{
        dataVisita:{
          data :null,
          hora: 0,
          minuto: 0
        },
        dataInstalacao:{
          data :null,
          hora: 0,
          minuto: 0
        },
      }
    });

    if(pedido['datasPedidos'].dataVisita){
      const visita = new Date(pedido['datasPedidos'].dataVisita)
      visita.setHours(visita.getHours() - 3)
      const dataVisita = visita.toISOString()

      const tempoSeparado = dataVisita.split('T')
      const datas = tempoSeparado[0].split("-");
      //`${datas[2]}/${datas[1]}/${datas[0]}`
      this.editForm.patchValue({
        datas:{
          dataVisita:{
            data: `${datas[1]}/${datas[2]}/${datas[0]}`,
            hora: tempoSeparado[1].split(":")[0],
            minuto: tempoSeparado[1].split(":")[1]
          },
        }
      })
    }

    if(pedido['datasPedidos'].dataInstalacao){
      const instalacao = new Date(pedido['datasPedidos'].dataInstalacao)
      instalacao.setHours(instalacao.getHours() - 3)
      const dataInstalacao = instalacao.toISOString()


      const tempoSeparado = dataInstalacao.split('T')
      const datas = tempoSeparado[0].split("-");

      this.editForm.patchValue({
        datas:{
          dataInstalacao:{
            data: `${datas[1]}/${datas[2]}/${datas[0]}`,
            hora: tempoSeparado[1].split(":")[0],
            minuto: tempoSeparado[1].split(":")[1]
          }
        }
      })
    }

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
           formValues.indicacao === this.pedidoEmEdicao.indicacao &&
           formValues.observacao === this.pedidoEmEdicao.observacao &&
           formValues.datas === this.pedidoEmEdicao.datas &&

          //  formValues.detalhes.trafegoPago === this.pedidoEmEdicao.detalhes.trafegoPago &&
           formValues.detalhes.orcamentoGerado === this.pedidoEmEdicao.detalhes.orcamentoGerado &&
           formValues.detalhes.contratoAssinado === this.pedidoEmEdicao.detalhes.contratoAssinado &&
           formValues.detalhes.visitaRealizada === this.pedidoEmEdicao.detalhes.visitaRealizada &&
           formValues.detalhes.equipamentoComprado === this.pedidoEmEdicao.detalhes.equipamentoComprado &&
           formValues.detalhes.sistemaHomologado === this.pedidoEmEdicao.detalhes.sistemaHomologado;


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

  selecionarCriterio(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    this.criterioOrdenacao = selectElement.value
    this.ordenarPor()
  }

  ordenarPor(): void {
    const criterio = this.criterioOrdenacao
    if (criterio === 'consumoDeEnergiaMensal' || criterio === 'idPedido') {
      this.list.sort((a, b) => {
        let firstValue = +a[criterio];
        let secondValue = +b[criterio];
        return this.orderDirection === 'asc' ? firstValue - secondValue : secondValue - firstValue;
      });
    } else {
      this.list.sort((a, b) => {
        return this.orderDirection === 'asc' ? a[criterio].localeCompare(b[criterio]) : b[criterio].localeCompare(a[criterio]);
      });
    }

  }


  setOrderDirection(direction: string): void {
    this.orderDirection = direction;
    this.ordenarPor()
  }

  onCardSelect(pedido: IPedido): void {
    pedido.selected = !pedido.selected;
    this.updateSelectedCardIds();
  }

  private updateSelectedCardIds(): void {
    this.listaPedidosId = this.list
      .filter(pedido => pedido.selected)
      .map(pedido => pedido.idPedido);
  }

  avancarPedidos(){
    this.pedidosService.avancarPedidos(this.listaPedidosId).subscribe( avancado => {
      if(avancado){
        Swal.fire({
          icon: "success",
          title: "Pedidos Avançados!",
          confirmButtonColor: "#3C58BF"
        });
        this.listaPedidosId = [];
        this.reloadDisplay();
        this.atualizarPedidos();
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedidos Não Avançados!",
        });
      }
    })
  }

  retrocederPedidos(){
    this.pedidosService.retrocederPedidos(this.listaPedidosId).subscribe( avancado => {
      if(avancado){
        Swal.fire({
          icon: "success",
          title: "Pedidos Retrocedidos!",
          confirmButtonColor: "#3C58BF"
        });
        this.listaPedidosId = [];
        this.reloadDisplay();
        this.atualizarPedidos();
      }else{
        Swal.fire({
          icon: "error",
          title: "Pedido Não Retrocedidos!",
        });
      }
    })
  }

  onSubmit() {
    if (this.editForm.valid) {


      if(this.editForm.value.faturamento <= 0){
        this.editForm.value.faturamento = null
      }



      this.editForm.get('datas').get('dataVisita').get("data")
      .setValue(this.formatarDataEvento(this.editForm.value.datas.dataVisita))

      this.editForm.get('datas').get('dataInstalacao').get("data")
      .setValue(this.formatarDataEvento(this.editForm.value.datas.dataInstalacao))

      console.log(this.editForm.value)
      this.pedidosService.updatePedido(this.pedidoEmEdicao.idPedido,this.editForm.value).subscribe(resp =>{
        this.atualizarPedidos()
      })

      // this.editForm.patchValue({
      //   datas:{
      //     dataVisita: this.formatarData(this.editForm.value.datas.dataVisita.data),
      //     dataInstalacao: this.formatarData(this.editForm.value.datas.dataInstalacao.data)
      //   }
      // })


      this.closeModal()
    } else {
      console.log('cep é inválido devido a:', this.editForm.errors);
    }
  }

  enviarPara(){
    // Serve para escolher qual estágio irá o grupo de pedidos

    const opcoes = {
      '1': 'Opção 1',
      '2': 'Opção 2',
      '3': 'Opção 3'
      // Adicione mais opções conforme necessário
    };


    Swal.fire({
      title: 'Selecione uma opção',
      input: 'select',
      inputOptions: Constantes.pedidos,
      inputPlaceholder: 'Selecione',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === '') {
            resolve('Você precisa selecionar uma opção');
          } else {
            resolve('');
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Opção selecionada:', result.value);
        // Processe a opção selecionada usando result.value
      }
    });
  }
}

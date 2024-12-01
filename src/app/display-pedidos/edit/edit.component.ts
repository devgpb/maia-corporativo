import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { IPedido } from 'src/app/interfaces/IPedido';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import Swal from 'sweetalert2';
import * as Constantes from "../../constants";




@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() detalhes: IPedido;
  @Input() rotaEspecial: boolean = false;
  @Input() list: IPedido[];

  @Output() atualizarPedidos = new EventEmitter<any>();

  public editForm: FormGroup;
  public pedidoEmEdicao: any;
  public indiceDetalhe: number = 0;
  public indiceLimiteDetalhe: number = 0;
  public userCargo = "";
  public user: IUser;
  public bsConfig: Partial<BsDatepickerConfig>;
  private handlePopStateBound: () => void;
  public tiposPagamentos = Constantes.tiposPagamentos;

  constructor(
    private modalService: ModalService,
    private pedidosService: PedidosService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {
    this.handlePopStateBound = this.handlePopState.bind(this);
  }


  ngOnInit(): void {
    this.user = this.authService.getUser()
    this.userCargo = this.user.cargo
    this.editForm = this.initializeForm();
    this.editForm.get('ref')?.disable();
    this.editForm.get('status')?.disable();
    this.localeService.use('pt-br');
    this.indiceDetalhe = this.list.indexOf(this.detalhes)
    this.indiceLimiteDetalhe = this.list.length
    this.bsConfig = {
      containerClass: 'theme-default',
    };
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.restoredState && event.restoredState.navigationId) {
          // Ação desejada
          console.log('Botão de voltar pressionado');

          // Cancelar a navegação
          this.location.replaceState(this.location.path()); // Mantém a URL atual sem alterar
        }
      }
    });

    // Adiciona um ouvinte para eventos de popstate
    window.addEventListener('popstate', this.handlePopStateBound);
  }

  handlePopState(event: PopStateEvent) {
    // Ação desejada
    console.log('Botão de voltar pressionado (popstate)');

    // Cancelar a navegação
    this.location.replaceState(this.location.path()); // Mantém a URL atual sem alterar
  }

  ngOnDestroy() {
    // Remove o ouvinte ao destruir o componente
    window.removeEventListener('popstate', this.handlePopStateBound);
  }

  onSubmit() {
    if (this.editForm.valid) {

      if (this.editForm.value.faturamento <= 0) {
        this.editForm.value.faturamento = null
      }

      this.editForm.get('datas').get('dataVisita').get("data")
        .setValue(this.formatarDataEvento(this.editForm.value.datas.dataVisita))

      this.editForm.get('datas').get('dataInstalacao').get("data")
        .setValue(this.formatarDataEvento(this.editForm.value.datas.dataInstalacao))

      this.pedidosService.updatePedido(this.pedidoEmEdicao.idPedido, this.editForm.value).subscribe(resp => {
        this.atualizarPedidos.emit()
      })

      this.toggleModal()
    } else {
      console.log('cep é inválido devido a:', this.editForm.errors);
    }
  }

  get getShowDrive() {
    try{

      if(this.pedidoEmEdicao.linkDrive){
        return true
      }
    }catch{
      return false
    }
    return false
  }


  gerarFormEdicao(pedido: IPedido) {
    const data = new Date(pedido.dataPedido)

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
      cpfCliente: pedido.cpfCliente,
      formaPagamento: pedido.formaPagamento,
      ref: pedido.ref,
      indicacao: pedido.indicacao,
      observacao: pedido.observacao,
      detalhes: pedido.detalhes,
      datas: {
        dataVisita: {
          data: null,
          hora: 0,
          minuto: 0
        },
        dataInstalacao: {
          data: null,
          hora: 0,
          minuto: 0
        },
      }
    });

    if (pedido['datasPedidos'].dataVisita) {
      const visita = new Date(pedido['datasPedidos'].dataVisita)
      visita.setHours(visita.getHours() - 3)
      const dataVisita = visita.toISOString()

      const tempoSeparado = dataVisita.split('T')
      const datas = tempoSeparado[0].split("-");
      //`${datas[2]}/${datas[1]}/${datas[0]}`
      this.editForm.patchValue({
        datas: {
          dataVisita: {
            data: `${datas[1]}/${datas[2]}/${datas[0]}`,
            hora: tempoSeparado[1].split(":")[0],
            minuto: tempoSeparado[1].split(":")[1]
          },
        }
      })
    }

    if (pedido['datasPedidos'].dataInstalacao) {
      const instalacao = new Date(pedido['datasPedidos'].dataInstalacao)
      instalacao.setHours(instalacao.getHours() - 3)
      const dataInstalacao = instalacao.toISOString()


      const tempoSeparado = dataInstalacao.split('T')
      const datas = tempoSeparado[0].split("-");

      this.editForm.patchValue({
        datas: {
          dataInstalacao: {
            data: `${datas[1]}/${datas[2]}/${datas[0]}`,
            hora: tempoSeparado[1].split(":")[0],
            minuto: tempoSeparado[1].split(":")[1]
          }
        }
      })
    }

    this.pedidoEmEdicao = pedido
  }

  marcarStandby() {
    this.pedidosService.marcarStandby(this.pedidoEmEdicao.idPedido).subscribe(pedido => {
      if (pedido) {
        Swal.fire({
          icon: "success",
          title: "Pedido Em StandBy!",
          confirmButtonColor: "#3C58BF"
        }).then(() => {
          this.atualizarPedidos.emit()
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Operação Não Realizada, Favor Contatar Suporte!",
        });
      }
    })
  }

  marcarPerdido() {
    this.pedidosService.marcarPerdido(this.pedidoEmEdicao.idPedido).subscribe(pedido => {
      if (pedido) {
        Swal.fire({
          icon: "success",
          title: "Pedido Em Perdidos!",
          confirmButtonColor: "#3C58BF"
        }).then(() => {
          this.atualizarPedidos.emit()
        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Operação Não Realizada, Favor Contatar Suporte!",
        });
      }
    })
  }

  toggleDetalhe(detalhe: string) {
    const detalhesAtualizados = {
      ...this.editForm.value.detalhes, // copia todas as propriedades existentes
      [detalhe]: !this.editForm.value.detalhes[detalhe] // sobrescreve apenas a propriedade específica
    };

    this.editForm.patchValue({
      detalhes: detalhesAtualizados
    });

  }

  voltarPedido(pedido: IPedido, edit = false) {
    const indexAntigo = this.list.indexOf(pedido)
    this.detalhes = this.list[indexAntigo - 1]
    this.indiceDetalhe = indexAntigo - 1
    this.gerarFormEdicao(this.detalhes)
  }

  proximoPedido(pedido: IPedido, edit = false) {
    const indexAntigo = this.list.indexOf(pedido)
    this.detalhes = this.list[indexAntigo + 1]
    this.indiceDetalhe = indexAntigo + 1
    this.gerarFormEdicao(this.detalhes)
  }

  // UTILS
  toggleModal() {
    this.modalService.toggle();
  }

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
      cpfCliente: [''],
      formaPagamento: [null],
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

  formatarDataEvento(dataString: any) {
    if (dataString.data == null || dataString.data == undefined) {
      return null
    }

    const dataEventos = new Date(dataString.data)
    dataEventos.setHours(dataString.hora, dataString.minuto, 0);

    dataString.data = dataEventos

    return dataString.data;
  }

  nothingChanged(): boolean {
    const formValues = this.editForm.value;

    return formValues.nomeCompleto === this.pedidoEmEdicao?.nomeCompleto &&
      formValues.celular === this.pedidoEmEdicao?.celular &&
      formValues.email === this.pedidoEmEdicao?.email &&
      formValues.cidade === this.pedidoEmEdicao?.cidade &&
      formValues.rua === this.pedidoEmEdicao?.rua &&
      formValues.cep === this.pedidoEmEdicao?.cep &&
      formValues.consumoDeEnergiaMensal === this.pedidoEmEdicao?.consumoDeEnergiaMensal &&
      formValues.faturamento === this.pedidoEmEdicao?.faturamento &&
      formValues.dataPedido === new Date(this.pedidoEmEdicao?.dataPedido) &&
      formValues.indicacao === this.pedidoEmEdicao?.indicacao &&
      formValues.observacao === this.pedidoEmEdicao?.observacao &&
      formValues.datas === this.pedidoEmEdicao?.datas &&
      formValues.cpfCliente === this.pedidoEmEdicao?.cpfCliente &&
      formValues.formaPagamento === this.pedidoEmEdicao?.formaPagamento &&

      //  formValues.detalhes.trafegoPago === this.pedidoEmEdicao?.detalhes.trafegoPago &&
      formValues.detalhes.orcamentoGerado === this.pedidoEmEdicao?.detalhes.orcamentoGerado &&
      formValues.detalhes.contratoAssinado === this.pedidoEmEdicao?.detalhes.contratoAssinado &&
      formValues.detalhes.visitaRealizada === this.pedidoEmEdicao?.detalhes.visitaRealizada &&
      formValues.detalhes.equipamentoComprado === this.pedidoEmEdicao?.detalhes.equipamentoComprado &&
      formValues.detalhes.sistemaHomologado === this.pedidoEmEdicao?.detalhes.sistemaHomologado &&
      formValues.detalhes.documentacaoGerada === this.pedidoEmEdicao?.detalhes.documentacaoGerada


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

  appyCPFMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o celular
    value = value.substring(0, 11);

    value = value.replace(/^(\d{3})(\d)/g, '$1.$2'); // Coloca ponto após o terceiro dígito
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca ponto após o terceiro dígito
    value = value.replace(/(\d{3})(\d)/, '$1-$2'); // Coloca hífen após o sexto dígito
    event.target.value = value;
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

  get canShowFormaPagamento() {
    return this.userCargo === "ADMINISTRADOR" && this.pedidoEmEdicao?.status === "FECHADO"
  }

  ngOnChanges(changes: SimpleChanges) {


    if (changes['detalhes'] && this.detalhes) {

      this.gerarFormEdicao(this.detalhes)
      this.indiceDetalhe = this.list.indexOf(this.detalhes)
      this.indiceLimiteDetalhe = this.list.length
    }
  }
}

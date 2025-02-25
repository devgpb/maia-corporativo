import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, OnDestroy, HostListener  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { IPedido } from 'src/app/interfaces/IPedido';
import { IUser } from 'src/app/interfaces/IUser';
import { mapaEquipamentos, tiposSuportes } from '../../constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { EquipamentosService } from '../../services/equipamentos/equipamento.service';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import * as Constantes from "../../constants";
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';




@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() detalhes: IPedido;
  @Input() rotaEspecial: boolean = false;
  @Input() list: IPedido[];
  @Input() canEdit: boolean = true;


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
  public mapaEquipamentos = mapaEquipamentos;
  public equipamentos: any = {
    inversores: [],
    placas: []
  };
  public show = 'none';
  public qrLink = null;
  public qrLabel = '';
  public qrText = '';
  tiposSuportes = tiposSuportes

  constructor(
    private modalService: ModalService,
    private pedidosService: PedidosService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private equipamentosService: EquipamentosService,
    private route: ActivatedRoute,
    private storageService: StorageService,

  ) {
    this.handlePopStateBound = this.handlePopState.bind(this);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isInputFocused()) {
      switch (event.key) {
        case 'ArrowLeft':
          this.voltarPedido(this.detalhes,true);
          break;
        case 'ArrowRight':
          this.proximoPedido(this.detalhes,true);
          break;
        case 'Enter':
          if(this.canEdit)
            this.enviaFormulario();
          break;
        case 'Escape':
          event.preventDefault();
          this.toggleModal();
          break;
        default:
          break;
      }
    }
  }

  isInputFocused(): boolean {
      const activeElement = document.activeElement as HTMLElement;
      return activeElement instanceof HTMLInputElement ||
             activeElement instanceof HTMLTextAreaElement ||
             activeElement.isContentEditable;
  }


  ngOnInit(): void {
    this.user = this.authService.getUser()
    this.userCargo = this.user.cargo
    this.editForm = this.initializeForm();
    this.editForm.get('ref')?.disable();
    this.editForm.get('status')?.disable();
    this.editForm.get('regiao')?.disable();

    this.localeService.use('pt-br');
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip
    })

    this.indiceDetalhe = this.list.indexOf(this.detalhes)
    this.indiceLimiteDetalhe = this.list.length
    this.bsConfig = {
      adaptivePosition: true,
    };

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.restoredState && event.restoredState.navigationId) {
          // Cancelar a navegação
          this.location.replaceState(this.location.path()); // Mantém a URL atual sem alterar
        }
      }
    });

    // Adiciona um ouvinte para eventos de popstate
    window.addEventListener('popstate', this.handlePopStateBound);
  }

  initializeForm() {
    // Inicialização do formulário
    return this.fb.group({
      nomeCompleto: [null, Validators.required],
      celular: [null, [Validators.required, Validators.minLength(12)]],
      endereco: [null],
      status: [null, Validators.required],
      email: [null],
      consumo: [null],
      faturamento: [0],
      dataPedido: [null, Validators.required],
      linkMaps: [null],
      observacao: [null],
      detalhes: [{}],
      cpfCliente: [null],
      formaPagamento: [null],
      regiao: [null],
      ref: [null],
      indicacao: [null],
      instalacao: this.fb.group({
        potenciaGerador: [null],
        distribuidora: [null],
        inversores: [null],
        quantidadeInversores: [null],
        garantiaFabricacaoInversor: [null],
        placas: [null],
        quantidadePlacas: [null],
        garantiaFabricacaoPlaca: [null],
        garantiaPerformancePlaca: [null],
        suporte: [null],
        quantidadeSuportes: [null],
        dataInicio: [null],
        dataFim: [null],
        quantidadeTubos: [null],
        quantidadeConexoes: [null],
        comprimentoAterramento: [null],
        metragemCabeamento: [null],
      }),
      datas: this.fb.group({
        dataVisita: this.fb.group({
          data: [null],
          hora: [0],
          minuto: [0]
        }),
        dataInstalacao: this.fb.group({
          data: [null],
          hora: [0],
          minuto: [0]
        }),
      }),
    });
  }

  irGerarContrato() {
    this.toggleModal();
    // this.storageService.setItem('pedido', JSON.stringify(this.pedidoEmEdicao))
    this.router.navigate([`/contrato/gerar/${this.pedidoEmEdicao.idPedido}`])
  }

  handlePopState(event: PopStateEvent) {
    // Cancelar a navegação
    this.location.replaceState(this.location.path()); // Mantém a URL atual sem alterar
  }

  ngOnDestroy() {
    // Remove o ouvinte ao destruir o componente
    window.removeEventListener('popstate', this.handlePopStateBound);
  }

  enviaFormulario() {
    if(this.editForm.valid) {

      if (this.editForm.value.faturamento <= 0) {
        this.editForm.value.faturamento = null
      }

      // this.editForm.get('datas').get('dataVisita').get("data")
      //   .setValue(this.formatarDataEvento(this.editForm.value.datas.dataVisita))

      // this.editForm.get('datas').get('dataInstalacao').get("data")
      //   .setValue(this.formatarDataEvento(this.editForm.value.datas.dataInstalacao))
      this.show = 'loading';
      this.pedidosService.updatePedido(this.pedidoEmEdicao.idPedido, this.editForm.value).subscribe(resp => {
        this.show = 'none';
        Swal.fire({
          icon: "success",
          title: "Pedido Atualizado!",
          confirmButtonColor: "#3C58BF"
        })
        this.atualizarPedidos.emit()
      })

      // this.toggleModal()
    } else {
      console.log('formulário é inválido devido a:', this.editForm.errors);
    }
  }

  onSubmit() {
    this.enviaFormulario()
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

  goToDrive(event: any) {
    event.preventDefault()
    window.open(this.pedidoEmEdicao.linkDrive, "_blank")
  }

  tratarData(control: string) {
    const form = this.editForm.get(control);
    if (form?.value) {
      const data = new Date(form.value);
      data.setHours(0, 0, 0, 0);
      form.setValue(data);
    }
  }

  gerarFormEdicao(pedido: IPedido) {
    this.editForm.reset();

    this.patchForm(this.editForm, pedido);
    this.tratarData("instalacao.dataInicio");
    this.tratarData("instalacao.dataFim");

    this.pedidoEmEdicao = pedido
  }

  patchForm(formGroup: FormGroup, data: any) {
    Object.keys(formGroup.controls).forEach(key => {
      if (formGroup.get(key) instanceof FormGroup && data[key]) {
        // Se o controle for um FormGroup e o dado também existir, recursivamente preenche os campos aninhados
        this.patchForm(formGroup.get(key) as FormGroup, data[key]);
      } else if (formGroup.get(key) instanceof FormArray && Array.isArray(data[key])) {
        // Para arrays, mapeia os valores
        const formArray = formGroup.get(key) as FormArray;
        formArray.clear(); // Remove quaisquer itens anteriores
        data[key].forEach((item: any) => {
          formArray.push(this.fb.group(item));
        });
      } else if (data[key] !== undefined) {
        // Preenche o valor para controles simples
        formGroup.get(key)?.patchValue(data[key]);
      }
    });
  }

  onInversorChange(event: any) {
    this.editForm.get("garantiaFabricacaoInversor").setValue(event.garantiaFabricacao)
  }

  onModuloChange(event: any) {
    this.editForm.get("garantiaPerformancePlaca").setValue(event.garantiaPerformance)
    this.editForm.get("garantiaFabricacaoPlaca").setValue(event.garantiaFabricacao)
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
    if(indexAntigo === 0)
      return
    this.detalhes = this.list[indexAntigo - 1]
    this.indiceDetalhe = indexAntigo - 1
    this.gerarFormEdicao(this.detalhes)
  }

  proximoPedido(pedido: IPedido, edit = false) {
    const indexAntigo = this.list.indexOf(pedido)
    if(indexAntigo + 1 == this.list.length)
      return

    this.detalhes = this.list[indexAntigo + 1]
    this.indiceDetalhe = indexAntigo + 1
    this.gerarFormEdicao(this.detalhes)
  }

  // UTILS
  toggleModal() {
    this.modalService.toggle();
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
      formValues.endereco === this.pedidoEmEdicao?.endereco &&
      formValues.consumo === this.pedidoEmEdicao?.consumo &&
      formValues.faturamento === this.pedidoEmEdicao?.faturamento &&
      formValues.dataPedido === new Date(this.pedidoEmEdicao?.dataPedido) &&
      formValues.indicacao === this.pedidoEmEdicao?.indicacao &&
      formValues.observacao === this.pedidoEmEdicao?.observacao &&
      formValues.datas === this.pedidoEmEdicao?.datas &&
      formValues.cpfCliente === this.pedidoEmEdicao?.cpfCliente &&
      formValues.formaPagamento === this.pedidoEmEdicao?.formaPagamento &&

      //  formValues.detalhes.trafegoPago === this.pedidoEmEdicao?.detalhes.trafegoPago &&
      formValues.detalhes.notaFiscalEnviada === this.pedidoEmEdicao?.detalhes.notaFiscalEnviada &&
      formValues.detalhes.contratoAssinado === this.pedidoEmEdicao?.detalhes.contratoAssinado &&
      formValues.detalhes.visitaRealizada === this.pedidoEmEdicao?.detalhes.visitaRealizada &&
      formValues.detalhes.equipamentoComprado === this.pedidoEmEdicao?.detalhes.equipamentoComprado &&
      formValues.detalhes.ART === this.pedidoEmEdicao?.detalhes.ART &&
      formValues.detalhes.pagamentoRealizado === this.pedidoEmEdicao?.detalhes.pagamentoRealizado
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

  adicionarDrive() {
    this.pedidosService.addDrive(this.pedidoEmEdicao.idPedido).subscribe(dados => {
      this.pedidoEmEdicao.linkDrive = dados.linkDrive
    })
  }

  gerarQrCode(tipo: string){
    switch(tipo){
      case 'drive':
        this.qrLink = this.pedidoEmEdicao.linkDrive;
        this.qrLabel = 'Link do Google Drive';
        this.qrText = this.pedidoEmEdicao.nomeCompleto
        break;
      case 'vistoInicial':
        this.qrLink = environment.url + '/pedido/vistoria/externo?hash=' + this.pedidoEmEdicao.hash;
        this.qrLabel = 'Link para Vistoria Inicial Pedido - ' + this.pedidoEmEdicao.idPedido;
        this.qrText = this.pedidoEmEdicao.nomeCompleto
        break;
      case 'finalizar':
        this.qrLink = environment.url + '/pedido/finalizar/externo?hash=' + this.pedidoEmEdicao.hash;
        this.qrLabel = 'Link para Vistoria Final Pedido - ' + this.pedidoEmEdicao.idPedido;
        this.qrText = this.pedidoEmEdicao.nomeCompleto
        break;
      case 'visualizar':
        this.qrLink = environment.instaladorURL + '/pedido/visualizar?hash=' + this.pedidoEmEdicao.hash;
        this.qrLabel = 'Link para Visualizar Pedido - ' + this.pedidoEmEdicao.idPedido;
        this.qrText = this.pedidoEmEdicao.nomeCompleto
        break;
      default:
        this.qrLink = null;
        break;
    }
    this.show = 'code';
  }

  fecharCode(){
    this.show = 'none';
    this.qrLink = null;
  }
}

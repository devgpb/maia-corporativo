import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import Swal from 'sweetalert2';
import { mapaEquipamentos, tiposSuportes } from '../constants';
import { animate, style, transition, trigger } from '@angular/animations';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';


import * as moment from 'moment';
// Importar o locale em português
import 'moment/locale/pt-br';
import { toInt } from 'ngx-bootstrap/chronos/utils/type-checks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-criar-contrato',
  templateUrl: './criar-contrato.component.html',
  styleUrls: ['./criar-contrato.component.scss'],
  animations: [
    trigger('onEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ]),
    trigger('onLeave', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class CriarContratoComponent implements OnInit {

  azul = false;
  tipoContrato = undefined;
  // O nível de pagamento serve para controlar os inputs, baseado na forma de pagamento a vista
  nivelPagamentoVista = 0
  mapaEquipamentos = mapaEquipamentos
  tiposSuportes = tiposSuportes
  equipamentos: any = {
    inversores: [],
    placas: []
  };

  public identificacao = 'cpf';

  constructor(
    private automacoesService: AutomacoesService,
    private equipamentosService: EquipamentosService,
    private route: ActivatedRoute,
    private pedidosService: PedidosService,
  ){

  }

  contrato = {
    numeroContrato : null,
    celular: null,
    idCliente: null,
    email: null,
    cidade: null,
    data: null,
    potenciaGerador: null,
    nomeContratante: null,
    cpfContratante: null,
    cnpjContratante: null,
    garantiaFabricacaoInversor: null,
    garantiaPerformancePlaca: null,
    garantiaFabricacaoPlaca: null,
    identificacao: null,
    enderecoInstalacao: null,
    inversores: null,
    modulos: null,
    suporte: null,
    pagamentoTotal: null,
    pagamentoP1: null,
    pagamentoP2: null,
    pagamentoP3: null,
    quantInversores: null,
    quantModulos: null,
    quantSuporte: null,
    distribuidora:null
  };



  ngOnInit(): void {
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip,
      this.loadContrato()
    })

    this.route.paramMap.subscribe(params => {
      const idCliente = params.get('id');
      if (idCliente) {
        this.contrato.idCliente = idCliente;
        console.log(this.contrato.idCliente)
      }
    });

    moment.locale('pt-br');

    this.contrato.data = moment().format('LL');
  }


  loadContrato() {
    var savedPedido = null;
    const savedTipoContrato = localStorage.getItem('tipoContrato');
    const nivelPagamentoVista = localStorage.getItem('nivelPagamentoVista');
    const savedContrato = localStorage.getItem('contrato');

    this.pedidosService.getPedido(this.contrato.idCliente).subscribe(pedidos => {
      console.log(pedidos)
      const pedido = pedidos[0];
      this.contrato.nomeContratante = pedido.nomeCompleto;
      this.contrato.celular = pedido.celular;
      this.contrato.email = pedido.email;
      this.contrato.cidade = pedido.cidade;
      this.contrato.enderecoInstalacao = pedido.endereco;
      this.contrato.cpfContratante = null;
      this.contrato.garantiaFabricacaoInversor = null;
      this.contrato.garantiaPerformancePlaca = null;
      this.contrato.garantiaFabricacaoPlaca = null;
      this.contrato.cnpjContratante = null;
      this.contrato.distribuidora = pedido.distribuidora;
      this.contrato.enderecoInstalacao = `${pedido.endereco}`;
      this.contrato.cpfContratante = pedido.cpfCliente;
      this.contrato.cnpjContratante = pedido.rgCliente;
      if (savedContrato) {
        const saved = JSON.parse(savedContrato);
        this.contrato.numeroContrato = saved.numeroContrato;
        this.pesquisarGarantiasEquipamentos();
      }
    }, error => {
      if (savedContrato) {
        const saved = JSON.parse(savedContrato);
        this.contrato = {...this.contrato, ...saved}
        this.pesquisarGarantiasEquipamentos();
      }
    })


    if (savedTipoContrato) {
      this.tipoContrato = JSON.parse(savedTipoContrato);
      this.nivelPagamentoVista = JSON.parse(nivelPagamentoVista);
    }
  }

  pesquisarGarantiasEquipamentos() {
    const inversor = this.equipamentos.inversores.find(inversor => inversor.nome == this.contrato.inversores);
    const placa = this.equipamentos.placas.find(placa => placa.nome == this.contrato.modulos);
    this.contrato.garantiaFabricacaoInversor = inversor.garantiaFabricacao;
    this.contrato.garantiaPerformancePlaca = placa.garantiaPerformance;
    this.contrato.garantiaFabricacaoPlaca = placa.garantiaFabricacao;
  }

  saveContrato() {
    localStorage.setItem('contrato', JSON.stringify(this.contrato));
    localStorage.setItem('tipoContrato', JSON.stringify(this.tipoContrato));
    localStorage.setItem('nivelPagamentoVista', JSON.stringify(this.nivelPagamentoVista));
  }

  formatToGo(value: any) {
    // Remove tudo o que não é dígito
    if(value){
      let num = value.replace(/\D/g, '');

      // Converte para número para remover zeros à esquerda, depois volta para string
      num = parseInt(num, 10).toString();

      // Reaplica a formatação de milhares
      // Esta expressão regular insere pontos como separadores de milhar
      num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return num == "NaN" ? "" : num;
    }

    return ""
  }

  formatNumbers() {
    const contrato = this.contrato;
    contrato.pagamentoTotal = this.formatToGo(contrato.pagamentoTotal)
    contrato.pagamentoP1 = this.formatToGo(contrato.pagamentoP1)
    contrato.pagamentoP2 = this.formatToGo(contrato.pagamentoP2)
    contrato.pagamentoP3 = this.formatToGo(contrato.pagamentoP3)
  }

  submitForm() {
    this.formatNumbers()

    // Adaptando para enviar
    this.contrato.identificacao = this.identificacao == 'cpf' ?
    "Pessoa Física, CPF n° " + this.contrato.cpfContratante :
    "Pessoa Jurídica, CNPJ n° " + this.contrato.cnpjContratante;
    const contrato = {...this.contrato, idPedido: this.contrato.idCliente};
    this.automacoesService.getContratoWord(this.tipoContrato,this.contrato).subscribe(response => {
      Swal.fire({
        icon: "success",
        title: "Seu Contrato Foi Gerado!",
        text: "Recomenda-se verificar os dados!",
        confirmButtonColor: "#3C58BF"
      });
      this.contrato.numeroContrato = (Number(this.contrato.numeroContrato) + 1).toString()
      this.saveContrato();
    }, error => {
      Swal.fire({
        icon: "error",
        title: "Há algo errado!",
        text: "Por favor, revise os campos ou entre em contato!",
        confirmButtonColor: "#3C58BF"
      });
      console.error('Erro na requisição:', error);
    });
  }

  setQuantModulos(event: any) {
    const valor = event.target.value;
    this.contrato.quantModulos = valor;
    this.contrato.quantSuporte = valor;
  }

  transformarEquipamento(tipo, valorString) {
    // Verificar se o tipo de equipamento existe no mapa
    if (!this.mapaEquipamentos[tipo]) {
        throw new Error(`Tipo de equipamento desconhecido: ${tipo}`);
    }

    // Dividir a string de propriedades com base nos espaços
    const propriedades = valorString.split(' ');

    // Dividir a string de chaves do mapaEquipamentos com base nos espaços
    const chaves = this.mapaEquipamentos[tipo].split(' ');

    // Verificar se a quantidade de propriedades corresponde
    if (propriedades.length !== chaves.length) {
        throw new Error(`Quantidade de propriedades não corresponde para o tipo ${tipo}`);
    }

    // Criar o objeto de equipamento com as chaves e valores correspondentes
    let objetoEquipamento = {};
    for (let i = 0; i < chaves.length; i++) {
        objetoEquipamento[chaves[i]] = propriedades[i];
    }

    return objetoEquipamento;
  }

  calcularPotenciaTotal() {
    // Quantidade de modelos x pot modulos. ex: (550 x 2) -> 1.100 -> 1,1 kW
    const moduloPotencia = (this.transformarEquipamento("placa", this.contrato.modulos) as any).potencia;
    const potencia  = parseFloat(moduloPotencia.replace(/[^0-9,]/g, '').replace(',', '.'));
    const resultado = Number(this.contrato.quantModulos) * potencia;
    const resultadoEmKW = resultado / 1000;
    this.contrato.potenciaGerador = resultadoEmKW.toFixed(1);
  }

  applyCpfMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o CPF
    value = value.substring(0, 11);

    // Aplica a máscara do CPF
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    event.target.value = value;
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

  validarNumero(event: KeyboardEvent) {
    // Permitir apenas dígitos numéricos
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  applyNumberMask(event: any): void {
    let value = event.target.value;
    // Remove tudo o que não é dígito
    value = value.replace(/\D/g, '');

    // Converte para número para remover zeros à esquerda, depois volta para string
    value = parseInt(value, 10).toString();

    // Reaplica a formatação de milhares
    // Esta expressão regular insere pontos como separadores de milhar
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    event.target.value = value;
  }

  applyCnpjMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 14 dígitos para o CNPJ
    value = value.substring(0, 14);

    // Aplica a máscara do CNPJ
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    event.target.value = value;
  }

  changeIdentificacao(identificacao: string) {
    // limpar o campo antes de trocar para evitar conflitos
    if (identificacao === 'cpf') {
      this.contrato.cpfContratante = '';
    } else {
      this.contrato.cnpjContratante = '';
    }

    this.identificacao = identificacao;
  }

  onInversorChange(event: any) {
    this.contrato.garantiaFabricacaoInversor = event.garantiaFabricacao;
  }

  onModuloChange(event: any) {
    this.contrato.garantiaPerformancePlaca = event.garantiaPerformance
    this.contrato.garantiaFabricacaoPlaca = event.garantiaFabricacao
  }

  selecionaTipoContrato(valor: string){

    switch (valor){
      case "umPagamentoAVista":
        this.nivelPagamentoVista = 1
      break

      case "doisPagamentosAVista":
        this.nivelPagamentoVista = 2
      break

      case "tresPagamentosAVista":
        this.nivelPagamentoVista = 3
      break

      case "financiamento":
        this.nivelPagamentoVista = 1
      break
    }

    this.tipoContrato = valor;
  }

  limparTipoContrato(event){
    event.preventDefault()
    this.tipoContrato = undefined
  }
}

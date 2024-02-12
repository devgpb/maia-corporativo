import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import Swal from 'sweetalert2';

import * as moment from 'moment';
// Importar o locale em português
import 'moment/locale/pt-br';
import { toInt } from 'ngx-bootstrap/chronos/utils/type-checks';

@Component({
  selector: 'app-criar-contrato',
  templateUrl: './criar-contrato.component.html',
  styleUrls: ['./criar-contrato.component.scss']
})

export class CriarContratoComponent implements OnInit {

  azul = false;
  tipoContrato = undefined;
  // O nível de pagamento serve para controlar os inputs, baseado na forma de pagamento a vista
  nivelPagamentoVista = 0


  equipamentos: any = {
    inversores: [],
    placas: []
  };

  constructor(
    private automacoesService: AutomacoesService,
    private equipamentosService: EquipamentosService
  ){

  }

  contrato = {
    numeroContrato : "",
    celular: "",
    email: "",
    cidade: "",
    data: "",
    potenciaGerador: "",
    nomeContratante: "",
    cpfContratante: "",
    enderecoInstalacao: "",
    inversores: null,
    modulos: null,
    suporte: "",
    pagamentoTotal: "",
    pagamentoP1: "",
    pagamentoP2: "",
    pagamentoP3: "",
    quantInversores: "",
    quantModulos: "",
    quantSuporte: ""
  };

  ngOnInit(): void {
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip
    })

    moment.locale('pt-br');

    this.loadContrato()

    this.contrato.data = moment().format('LL');
  }


  loadContrato() {
    const savedContrato = localStorage.getItem('contrato');
    const savedTipoContrato = localStorage.getItem('tipoContrato');
    const nivelPagamentoVista = localStorage.getItem('nivelPagamentoVista');

    if (savedContrato) {
      this.contrato = JSON.parse(savedContrato);
    }

    if (savedTipoContrato) {
      this.tipoContrato = JSON.parse(savedTipoContrato);
      this.nivelPagamentoVista = JSON.parse(nivelPagamentoVista);

    }

    const savedPedido = localStorage.getItem('pedido');
    if (savedPedido) {
      const pedido = JSON.parse(savedPedido);
      this.contrato.nomeContratante = pedido.nomeCompleto;
      this.contrato.celular = pedido.celular;
      this.contrato.email = pedido.email;
      this.contrato.cidade = pedido.cidade;
      this.contrato.enderecoInstalacao = pedido.endereco;
      this.contrato.cpfContratante = "";
      this.contrato.enderecoInstalacao = `${pedido.rua} ${pedido.cep}`;
    }
  }

  saveContrato() {
    localStorage.setItem('contrato', JSON.stringify(this.contrato));
    localStorage.setItem('tipoContrato', JSON.stringify(this.tipoContrato));
    localStorage.setItem('nivelPagamentoVista', JSON.stringify(this.nivelPagamentoVista));

  }

  formatToGo(value: any) {
    // Remove tudo o que não é dígito
    let num = value.replace(/\D/g, '');

    // Converte para número para remover zeros à esquerda, depois volta para string
    num = parseInt(num, 10).toString();

    // Reaplica a formatação de milhares
    // Esta expressão regular insere pontos como separadores de milhar
    num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return num == "NaN" ? "" : num;
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
        title: "Há algum campo faltando!",
        text: "Por favor, revise os campos ou entre em contato!",
        confirmButtonColor: "#3C58BF"
      });
      console.error('Erro na requisição:', error);
    });
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
    }

    this.tipoContrato = valor;
  }

  limparTipoContrato(event){
    event.preventDefault()
    this.tipoContrato = undefined
  }
}

import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import { ModalService } from '../services/modal/modal.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import html2pdf from 'html2pdf.js';

interface Proposta {
  nomeCliente: string;
  cidadeCliente: string;
  endereco: string;
  tipoConta: string;
  consumoCliente: string | number;
  custoProjeto: string | number;
  tipoInversor: string;
  telhadoCliente: string;
  valorEntrada: number;
  desconto: string | number;
  telefoneCliente: string;
  emailCliente: string;
}

export interface Projeto {
  inversor: string;
  quantPlacas: number;
  geracao: number;
  geracaoKit: number;
  kitSugerido: string;
  valorKit: string;
  valorTotal: string;
  valorCartao: string;
  valorFinanciado: string;
  prasoEntrega: number;
  potenciaPlaca: number;
  potInversor: number;
  mensagemSolo: string;
  mensagemCidade: string;
  primeiroAVista: string;
  segundoAVista: string;
}


@Component({
    selector: 'app-criar-proposta',
    templateUrl: './criar-proposta.component.html',
    styleUrls: ['./criar-proposta.component.scss'],
    animations: [
        trigger('fadeIn', [
            state('void', style({ opacity: 0 })),
            transition('void => *', [
                animate('0.6s ease-in', style({ opacity: 1 }))
            ])
        ])
    ],
    standalone: false
})

export class CriarPropostaComponent implements OnInit{

  proposta: Proposta = {
    nomeCliente: null,
    cidadeCliente: null,
    endereco: '',

    tipoConta: "Residencial",
    tipoInversor: "Microinversor",
    consumoCliente: '',

    custoProjeto: 0,
    desconto: "0%",
    telhadoCliente: "Solo",
    valorEntrada: 0,
    telefoneCliente: "",
    emailCliente: "",


  }

  infoPessoal = {
    rgCliente: "",
    identidadeCliente: "",
    estadoCliente: ""
  }

  public propostaCliente: Projeto;

  comDetalhesPessoais = false

  configMask = { prefix: '', thousands: '.', decimal: ',', allowNegative: false, align:'left', }
  loading: boolean = true;
  success: boolean = false;
  // fail: boolean = false;

  constructor(
    private automacoesService: AutomacoesService,
    private modalService: ModalService,

  ) { }

  ngOnInit(): void {
    this.loadProposta();
  }

  submitForm(){
    this.loading = true;
    this.success = false;

    // this.modalService.toggle();

    let propostaFinal = {...this.proposta};
    propostaFinal.consumoCliente = this.formatCurrencyToNumber(propostaFinal.consumoCliente.toString());
    propostaFinal.custoProjeto = this.formatCurrencyToNumber(propostaFinal.custoProjeto.toString());
    propostaFinal.valorEntrada = this.formatCurrencyToNumber(propostaFinal.valorEntrada.toString());
    // Tratar o valor do desconto
    const descontoInput = this.proposta.desconto.toString().replace('%', '');
    const desconto = descontoInput !== '' ? descontoInput : '0';
    propostaFinal.desconto = 1 - parseFloat(desconto) / 100;

    propostaFinal = this.comDetalhesPessoais ? {
      ...this.proposta, ...this.infoPessoal
    } : propostaFinal

    this.automacoesService.getPropostaWord(propostaFinal).subscribe(resp => {
      this.loading = false;
      this.success = true;
      this.propostaCliente = resp;
      this.saveProposta()
    }, error => {
      this.loading = false;
      this.success = false;
    });
  }

  saveProposta(){
    localStorage.setItem('proposta', JSON.stringify(this.proposta));
  }

  loadProposta(){
    const proposta = localStorage.getItem('proposta');
    if(proposta){
      this.proposta = JSON.parse(proposta);
    }
  }

  applyNumberMask(event: any){
    let value = event.target.value;

    // Remove caracteres que não sejam dígitos ou ponto decimal
    value = value.replace(/\D/g, '');

    // Insere o ponto decimal antes dos últimos 2 dígitos
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');

    // Insere pontos a cada 3 dígitos da esquerda para a direita, antes do ponto decimal
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');

    let numberValue = parseFloat(value.replace(',', '.'));
    value = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    event.target.value = value;
  }

  formatCurrencyToNumber(value: string): number {
    /// Remove os pontos de milhar
    value = value.replace(/\./g, '');

    // Substitui a vírgula do decimal por ponto
    value = value.replace(',', '.');

    // Converte a string para float
    const valorNumerico = parseFloat(value);

    return valorNumerico;

  }

  applyRgMask(event: any): void {
    let value = event.target.value;
    // Remove tudo o que não for dígito
    value = value.replace(/\D/g, '');

    // Limita a 9 dígitos para o RG
    value = value.substring(0, 9);

    // Aplica a máscara do RG: XX.XXX.XXX-X
    // A máscara é aplicada em uma única etapa para evitar conflitos entre as substituições
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})?/, '$1.$2.$3-$4');

    // Remove o traço final se não houver dígito após o traço
    value = value.replace(/-$/, '');

    event.target.value = value;
  }

  applyPercentMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 3 dígitos para a porcentagem
    value = value.substring(0, 3);

    // Adiciona o símbolo de porcentagem no final
    value = value + '%';

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

  downloadPdf() {
    const printContent = document.getElementById('printSection');
    const date = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
    const name = `Proposta-${this.proposta.nomeCliente.split(" ")[0]}-${date}.pdf`;

    const options = {
      margin: [10, 10, 10, 10], // margens ajustadas
      filename: name,
      image: { type: 'jpeg', quality: 1 },
      optimizeText: true,
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }, // evita quebras indesejadas
      html2canvas: {
        scale: 2, // ajuste a escala conforme necessário
        useCORS: true,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(printContent).set(options).save();
  }


}

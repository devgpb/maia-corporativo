import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import { ModalService } from '../services/modal/modal.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Proposta {
  nomeCliente: string;
  cidadeCliente: string;
  endereco: string;
  tipoConta: string;
  consumoEnergia: string | number;
  custoProjeto: string | number;
  tipoInversor: string;
  tipoEstrutura: string;
  valorEntrada: number;
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
  ]
})

export class CriarPropostaComponent implements OnInit{

  proposta: Proposta = {
    nomeCliente: "Fulano de Tal",
    cidadeCliente: "Cidade",
    endereco: '',

    tipoConta: "Residencial",
    tipoInversor: "Microinversor",
    consumoEnergia: '',

    custoProjeto: '',
    tipoEstrutura: "Fibrocimento",
    valorEntrada: 0,
  }

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

    this.modalService.toggle();

    const propostaFinal = {...this.proposta};
    propostaFinal.consumoEnergia = this.formatCurrencyToNumber(propostaFinal.consumoEnergia.toString());
    propostaFinal.custoProjeto = this.formatCurrencyToNumber(propostaFinal.custoProjeto.toString());
    propostaFinal.valorEntrada = this.formatCurrencyToNumber(propostaFinal.valorEntrada.toString());
    this.automacoesService.getPropostaWord(propostaFinal).subscribe(resp => {
      this.loading = false;
      this.success = true;
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
    console.log(value);
    /// Remove os pontos de milhar
    value = value.replace(/\./g, '');

    // Substitui a vírgula do decimal por ponto
    value = value.replace(',', '.');

    // Converte a string para float
    const valorNumerico = parseFloat(value);

    return valorNumerico;

  }
}

import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';

@Component({
  selector: 'app-criar-contrato',
  templateUrl: './criar-contrato.component.html',
  styleUrls: ['./criar-contrato.component.scss']
})

export class CriarContratoComponent implements OnInit {

  azul = false;

  constructor(
    private automacoesService: AutomacoesService
  ){

  }
  contrato = {
    numeroContrato : "",
    potenciaGerador: "",
    nomeContratante: "",
    cpfContratante: "",
    enderecoInstalacao: "",
    inversores: "",
    modulos: "",
    suporte: "",
    pagamentoTotal: "",
    pagamentoP1: "",
    pagamentoP2: "",
    quantInversores: "",
    quantModulos: "",
    quantSuporte: ""
  };

  ngOnInit(): void {
    this.loadContrato();
  }


  loadContrato() {
    const savedContrato = localStorage.getItem('contrato');
    if (savedContrato) {
      this.contrato = JSON.parse(savedContrato);
    }
  }

  saveContrato() {
    localStorage.setItem('contrato', JSON.stringify(this.contrato));
  }

  submitForm() {
    console.log(this.contrato);

    this.automacoesService.getContratoWord(this.contrato).subscribe(response => {
      console.log(response);
      this.saveContrato();
    }, error => {
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


  validarNumero(event: any) {
    const valor = event.target.value;
    if (valor <= 0 || !/^\d*$/.test(valor)) {
      event.target.value = null;
    }
  }
}

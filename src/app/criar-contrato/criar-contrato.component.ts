import { Component, OnInit } from '@angular/core';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';

@Component({
  selector: 'app-criar-contrato',
  templateUrl: './criar-contrato.component.html',
  styleUrls: ['./criar-contrato.component.scss']
})

export class CriarContratoComponent implements OnInit {

  azul = false;

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
    potenciaGerador: "",
    nomeContratante: "",
    cpfContratante: "",
    enderecoInstalacao: "",
    inversores: '',
    modulos: '',
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
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip
    })
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

    this.automacoesService.getContratoWord(this.contrato).subscribe(response => {
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


  validarNumero(event: KeyboardEvent) {
    // Permitir apenas dígitos numéricos
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
}

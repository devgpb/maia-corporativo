import { Component, OnInit } from '@angular/core';
import { EnderecoService } from '../services/enderecoService/endereco.service';
import { AutomacoesService } from '../services/automacoes/automacoes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-procuracao',
  templateUrl: './criar-procuracao.component.html',
  styleUrls: ['./criar-procuracao.component.scss']
})
export class CriarProcuracaoComponent implements OnInit{
  procuracao = {
    nomeCliente : "",
    isCasado: "",
    cpfCliente: "",
    ruaCliente: "",
    estadoCliente: "",
    cepCliente: "",
    cidadeDocumento: "",
  };

  constructor(
    private enderecoService: EnderecoService,
    private automacoesService: AutomacoesService
  ) {
  }

  ngOnInit(): void {
    this.carregarProcuracao();
  }

  criarProcuracao() {
    this.automacoesService.getProcuracaoWord(this.procuracao).subscribe(resp => {
      Swal.fire({
        icon: "success",
        title: "SUa Procuração Foi Gerada!",
        text: "Recomenda-se verificar os dados!",
        confirmButtonColor: "#3C58BF"
      });
      this.salvarProcuracao();
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

  carregarProcuracao() {
    const localProcuracao = JSON.parse(localStorage.getItem('procuracao'));
    if(localProcuracao) {
      this.procuracao = localProcuracao;
    }

    const savedPedido = localStorage.getItem('pedido');
    if (savedPedido) {
      const pedido = JSON.parse(savedPedido);
      this.procuracao.nomeCliente = pedido.nomeCompleto != '' ? pedido.nomeCompleto : localProcuracao.nomeCompleto;
      // this.procuracao.cpfCliente = pedido.cpf != '' ? pedido.cpf : localProcuracao.cpfCliente;
      this.procuracao.ruaCliente = pedido.rua != '' ? pedido.rua : localProcuracao.ruaCliente;

    }
  }

  salvarProcuracao() {
    localStorage.setItem('procuracao', JSON.stringify(this.procuracao));
  }

  onCepChange() {
    const cep = this.procuracao.cepCliente;

    if (cep && cep.length == 9) { // Verifique se o CEP tem 8 dígitos
      this.enderecoService.buscaEnderecoPorCep(cep).subscribe((endereco: any) => {
        this.procuracao.ruaCliente = endereco.logradouro;
        this.procuracao.estadoCliente = endereco.uf;
      });
    }
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

  applyCepMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 8 dígitos para o CEP
    value = value.substring(0, 8);

    value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca hífen após o quinto dígito
    event.target.value = value;
  }
}

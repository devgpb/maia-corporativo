import { Component, OnInit } from '@angular/core';
import { KitsSolaresService } from 'src/app/services/kits/kits-solares.service';
import Swal from 'sweetalert2';
import * as Constantes from "../../constants";

@Component({
  selector: 'app-kits-solares',
  templateUrl: './kits-solares.component.html',
  styleUrls: ['./kits-solares.component.scss']
})
export class KitsSolaresComponent implements OnInit {
  listaKitsSolares = [];
  inputRows = [];

  constructor(private kitsSolaresService: KitsSolaresService) { }

  ngOnInit(): void {
    this.carregarTabela();
  }

  carregarTabela() {
    this.kitsSolaresService.getAllKitsSolares().subscribe(kits => {

      this.listaKitsSolares = kits;
      this.ordenarKits();
    });
  }

  ordenarKits() {
    this.listaKitsSolares.sort((a, b) => {
      return a.geracao - b.geracao;
    });
  }

  adicionarKit() {
    const novoKit = {
      quantidadePlacas: null,
      geracao: null,
      nomeKit: '',
      valorKit: null
    };
    this.inputRows.push(novoKit);
  }

  salvarKit(kit: any) {
    this.kitsSolaresService.createKitSolar(kit).subscribe(resp => {
      const index = this.inputRows.indexOf(kit);
      if (index > -1) {
        this.inputRows.splice(index, 1);
      }
      this.listaKitsSolares.push(resp);
      this.ordenarKits();
    });
  }

  cancelarEdicao(kit: any) {
    const index = this.inputRows.indexOf(kit);
    if (index > -1) {
      this.inputRows.splice(index, 1);
    }
  }

  iniciarEdicao(kit: any) {
    // formatar valor para numero br
    kit.valorKit = this.formatToBRL(kit.valorKit);
    kit.isEditing = true;
    kit.editState = { ...kit };
  }

  formatToBRL(value) {
    // Converte o número para string com duas casas decimais
    value = parseFloat(value);
    let numeroStr = value.toFixed(2);

    // Usa expressão regular para adicionar as vírgulas como separador de milhares
    return numeroStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatToUSD(value) {
    // Remove os separadores de milhares (vírgulas)
    let numeroSemVirgula = value.replace(/,/g, '');

    // Transforma a string em float
    let numeroFloat = parseFloat(numeroSemVirgula);

    return numeroFloat;
  }

  salvarEdicao(kit: any) {
    // formatar valor para numero en
    kit.valorKit = this.formatToUSD(kit.valorKit);
    this.kitsSolaresService.updateKitSolar(kit.idKit, kit).subscribe(resp => {
      kit.isEditing = false;
    });
  }

  cancelarEdicaoExistente(kit: any) {
    Object.assign(kit, kit.editState)
    kit.valorKit = this.formatToUSD(kit.valorKit);
    kit.isEditing = false;
  }

  removerKit(kit: any) {
    Swal.fire({
      icon: "warning",
      title: 'Tem certeza que deseja excluir este kit?',
      showCancelButton: true,
      confirmButtonText: `Sim`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.kitsSolaresService.deleteKitSolar(kit.idKit).subscribe(resp => {
          this.listaKitsSolares = this.listaKitsSolares.filter(k => k.idKit !== kit.idKit);
        });
      }
    });
  }

  validarNumero(event: KeyboardEvent) {
    if (!/[0-9.,]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
  applyNumberMask(event: any): void {
    let value = event.target.value;

    // Remove tudo que não é número, ponto ou vírgula
    value = value.replace(/[^0-9.]/g, '');

    // Divide a parte inteira e a parte decimal pelo ponto
    const parts = value.split('.');

    // Mantém apenas a primeira parte como decimal (caso tenha mais de um ponto)
    if (parts.length > 2) {
      parts.splice(2);
    }

    // Formata a parte inteira com vírgulas para separar os milhares
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Se existir uma parte decimal, junta com a parte inteira
    if (parts.length > 1) {
      value = `${integerPart}.${parts[1]}`;
    } else {
      value = integerPart;
    }

    // Aplica o valor formatado de volta ao campo de input
    event.target.value = value;
  }


}

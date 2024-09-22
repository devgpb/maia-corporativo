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

  constructor(private kitsSolaresService: KitsSolaresService) {}

  ngOnInit(): void {
    this.carregarTabela();
  }

  carregarTabela() {
    this.kitsSolaresService.getAllKitsSolares().subscribe(kits => {
      this.listaKitsSolares = kits;
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
    });
  }

  cancelarEdicao(kit: any) {
    const index = this.inputRows.indexOf(kit);
    if (index > -1) {
      this.inputRows.splice(index, 1);
    }
  }

  iniciarEdicao(kit: any) {
    kit.isEditing = true;
    kit.editState = { ...kit };
  }

  salvarEdicao(kit: any) {
    this.kitsSolaresService.updateKitSolar(kit.idKit, kit).subscribe(resp => {
      kit.isEditing = false;
    });
  }

  cancelarEdicaoExistente(kit: any) {
    Object.assign(kit, kit.editState);
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
    // Remove tudo o que não é dígito
    value = value.replace(/\D/g, '');

    // Converte para número para remover zeros à esquerda, depois volta para string
    value = parseInt(value, 10).toString();

    // Reaplica a formatação de milhares
    // Esta expressão regular insere pontos como separadores de milhar
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    // se for Nan, seta vazio
    if (isNaN(parseInt(value, 10))) {
      value = '';
    }
    event.target.value = value;
  }
}

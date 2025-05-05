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
  listaKitsSolares: any[] = [];
  inputRows: any[] = [];

  constructor(private kitsSolaresService: KitsSolaresService) { }

  ngOnInit(): void {
    this.carregarTabela();
  }

  carregarTabela(): void {
    this.kitsSolaresService.getAllKitsSolares().subscribe(kits => {
      this.listaKitsSolares = kits;
      this.ordenarKits();
    });
  }

  ordenarKits(): void {
    this.listaKitsSolares.sort((a, b) => a.geracao - b.geracao);
  }

  adicionarKit(): void {
    this.inputRows.push({
      quantidadePlacas: null,
      geracao: null,
      nomeKit: '',
      valorKit: ''  // será preenchido como string formatada em BRL
    });
  }

  salvarKit(kit: any): void {
    // Converte a string BRL para float antes de enviar
    const payload = {
      ...kit,
      valorKit: this.parseBRL(kit.valorKit)
    };
    this.kitsSolaresService.createKitSolar(payload).subscribe(resp => {
      const idx = this.inputRows.indexOf(kit);
      if (idx > -1) this.inputRows.splice(idx, 1);
      this.listaKitsSolares.push(resp);
      this.ordenarKits();
    });
  }

  cancelarEdicao(kit: any): void {
    const idx = this.inputRows.indexOf(kit);
    if (idx > -1) this.inputRows.splice(idx, 1);
  }

  iniciarEdicao(kit: any): void {
    // Guarda o estado original (valorKit numérico) para possível cancelamento
    kit.editState = { ...kit };
    // Formata para BRL para exibição
    kit.valorKit = this.formatToBRL(kit.valorKit);
    kit.isEditing = true;
  }

  formatToBRL(value: number | string): string {
    // Garante número
    let num = typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(num)) num = 0;
    // Formata com duas casas decimais
    const [intPart, decPart] = num.toFixed(2).split('.');
    // Insere separadores de milhares com ponto
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Retorna no padrão BRL: "1.234,56"
    return `${formattedInt},${decPart}`;
  }

  parseBRL(value: string): number {
    if (typeof value !== 'string') return value as any;
    // Remove pontos de milhar, substitui vírgula decimal por ponto
    const normalized = value.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(normalized);
  }

  salvarEdicao(kit: any): void {
    // Converte de volta para float
    const payload = {
      ...kit,
      valorKit: this.parseBRL(kit.valorKit)
    };
    this.kitsSolaresService.updateKitSolar(kit.idKit, payload).subscribe(resp => {
      kit.isEditing = false;
      // Atualiza a exibição com o valor formatado novamente
      kit.valorKit = this.formatToBRL(payload.valorKit);
      delete kit.editState;
    });
  }

  cancelarEdicaoExistente(kit: any): void {
    // Restaura o estado original
    Object.assign(kit, kit.editState);
    kit.isEditing = false;
    delete kit.editState;
  }

  removerKit(kit: any): void {
    Swal.fire({
      icon: 'warning',
      title: 'Tem certeza que deseja excluir este kit?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.kitsSolaresService.deleteKitSolar(kit.idKit).subscribe(() => {
          this.listaKitsSolares = this.listaKitsSolares.filter(k => k.idKit !== kit.idKit);
        });
      }
    });
  }

  validarNumero(event: KeyboardEvent): void {
    // Permite apenas dígitos, vírgula, ponto (para milhar), backspace e tab
    if (!/[0-9,\.]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  applyNumberMask(event: any): void {
    let value: string = event.target.value;
    // Remove tudo que não seja dígito ou vírgula
    value = value.replace(/[^0-9,]/g, '');
    const parts = value.split(',');
    // Limita a duas casas decimais
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }
    // Formata parte inteira com separador de milhares
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Reconstrói valor
    const masked = parts[1] !== undefined ? `${intPart},${parts[1]}` : intPart;
    // Atualiza o campo de input
    event.target.value = masked;
    // (Com ngModel, o model será atualizado automaticamente)
  }
}

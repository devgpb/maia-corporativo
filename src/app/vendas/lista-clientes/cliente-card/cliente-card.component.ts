import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Cliente } from 'src/app/interfaces/ICliente';

@Component({
    selector: 'app-cliente-card',
    templateUrl: './cliente-card.component.html',
    styleUrls: ['./cliente-card.component.css'],
    standalone: false
})
export class ClienteCardComponent implements OnInit, OnChanges {
  @Input() cliente!: Cliente;

  dias!: number;
  corFundo!: string;
  corTexto!: string;
  @Output() edit = new EventEmitter<Cliente>();

  ngOnInit(): void {
    this.updateDias();
  }

  onEdit(): void {
    this.edit.emit(this.cliente);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente']) {
      this.updateDias();
    }
  }

  abrirWhatsapp(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const celularRaw = this.cliente?.celular || '';
    const celularLimpo = celularRaw.replace(/\D/g, '');

    const celularComDDI = celularLimpo.startsWith('55') ? celularLimpo : `55${celularLimpo}`;

    const url = `https://wa.me/${celularComDDI}`;

    window.open(url, '_blank');
  }


  private updateDias(): void {
    this.dias = this.calcularDias(this.cliente.updatedAt);
    this.corFundo = this.getCorDias(this.dias);
    this.corTexto = this.getCorTextoDias(this.dias);
  }

  private calcularDias(createdAt: string | Date): number {
    const hoje = new Date();
    const criacao = new Date(createdAt);
    const diffTime = Math.abs(hoje.getTime() - criacao.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getCorDias(dias: number): string {
    if (dias <= 7)  return 'bg-success';
    if (dias <= 15) return 'bg-warning';
    if (dias <= 30) return 'orange-bg';
                    return 'bg-danger';
  }

  private getCorTextoDias(dias: number): string {
    if (dias <= 7)  return 'text-success';
    if (dias <= 15) return 'text-warning';
    if (dias <= 30) return 'orange-text';
                    return 'text-danger';
  }
}

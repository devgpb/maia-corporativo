import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Cliente } from 'src/app/interfaces/ICliente';
import { ClientesService } from 'src/app/services/clientes/clientes.service';

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

  constructor(
    private clientesService: ClientesService,
  ){

  }

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

  get isUltimoContatoHoje(): boolean {
    if (!this.cliente.ultimoContato) return false;
    const ultimoContatoDate = new Date(this.cliente.ultimoContato);
    const hoje = new Date();
    return ultimoContatoDate.getDate() === hoje.getDate() &&
           ultimoContatoDate.getMonth() === hoje.getMonth() &&
           ultimoContatoDate.getFullYear() === hoje.getFullYear();
  }

  marcarContato(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const payload = {
      idCliente: this.cliente.idCliente,
      ultimoContato: new Date().toISOString(),
      updatedAt: new Date()
    }

    this.clientesService.postCliente(payload).subscribe({
      next: () => {
        this.cliente.ultimoContato = new Date().toISOString();
        this.cliente.updatedAt = new Date();
        this.updateDias();
      }
    });
  }


  private updateDias(): void {
    this.dias = this.calcularDias(this.cliente.updatedAt);
    this.corFundo = this.getCorDias(this.dias);
    this.corTexto = this.getCorTextoDias(this.dias);
  }

  private calcularDias(referencia: string | Date): number {
    const hoje = new Date();
    const refDate = new Date(referencia);

    hoje.setHours(0,0,0,0);
    refDate.setHours(0,0,0,0);

    const diffMs = hoje.getTime() - refDate.getTime();
    return Math.max(0, Math.floor(diffMs / 86400000));
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

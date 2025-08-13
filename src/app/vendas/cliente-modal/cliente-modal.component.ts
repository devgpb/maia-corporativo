import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges,
  OnInit
} from '@angular/core';
import { Cliente } from 'src/app/interfaces/ICliente';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cliente-modal',
    templateUrl: './cliente-modal.component.html',
    styleUrls: ['./cliente-modal.component.css'],
    standalone: false
})
export class ClienteModalComponent implements OnChanges, OnInit {
  @Input() cliente: Cliente;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave  = new EventEmitter<Cliente>();
  @Output() onUpdate = new EventEmitter<void>();
  cidades: string[] = [];
  listaCampanhas = [];
  statuses: string[] = [];

  constructor(
    private clientesService: ClientesService,
    private http: HttpClient,
  ){

  }

  formData!: Cliente;
  errors: Record<string,string> = {};
  isLoading = false;



  ngOnChanges(ch: SimpleChanges): void {
    if (ch['cliente'] && this.cliente) {
      this.formData = { ...this.cliente };
      this.errors = {};
      this.fetchFiltros();
    }

    // Garante que a campanha atual do cliente apareça no select
    if (this.formData.campanha && !this.listaCampanhas.includes(this.formData.campanha)) {
      this.listaCampanhas.push(this.formData.campanha);
    }

    // Garante que a cidade atual do cliente apareça no select
    if (this.formData.cidade && !this.cidades.includes(this.formData.cidade)) {
      this.cidades.push(this.formData.cidade);
    }
  }

  ngOnInit(){
    this.listaCampanhas = this.clientesService.listaDeCampanhas
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    if (!this.validate()) return;
    this.isLoading = true;
    // simula chamada async
    this.clientesService.postCliente(this.formData).subscribe(
       {
        next: () => {
          // Sucesso
          // @ts-ignore
          Swal.fire('Sucesso!', 'Cliente atualizado com sucesso.', 'success');
          this.onUpdate.emit();
          this.close();
        },
        error: () => {
          // Erro
          // @ts-ignore
          Swal.fire('Erro!', 'Ocorreu um erro ao atualizar o cliente.', 'error');
        }
      }
    )
    this.isLoading = false;

  }

  delete() {
    // @ts-ignore
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.clientesService.deleteClientes(this.cliente.idCliente).subscribe({
          next: () => {
            // @ts-ignore
            Swal.fire('Sucesso!', 'Cliente apagado com sucesso.', 'success').then(() => {
              this.isLoading = false;
              this.onUpdate.emit();
              this.close();
            });
          },
          error: () => {
            // @ts-ignore
            Swal.fire('Erro!', 'Ocorreu um erro ao apagar o cliente.', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  validate(): boolean {
    const e: any = {};
    if (!this.formData.nome?.trim())       e.nome    = 'Nome é obrigatório';
    if (!this.formData.celular?.trim())    e.celular = 'Celular é obrigatório';

    return Object.keys(e).length === 0;
  }

  clearError(field: string) {
    if (this.errors[field]) delete this.errors[field];
  }

  calcularDias(date: string|Date): number {
    const hoje = new Date(), cri = new Date(date);
    const diff = Math.abs(hoje.getTime()-cri.getTime());
    return Math.ceil(diff/(1000*60*60*24));
  }

  getBadgeClass(dias: number): string {
    if (dias <= 7)  return 'bg-primary';
    if (dias <= 15) return 'bg-secondary';
    if (dias <= 30) return 'bg-warning';
                    return 'bg-danger';
  }

  getBadgeText(dias: number): string {
    if (dias <= 7)  return 'Recente';
    if (dias <= 15) return 'Normal';
    if (dias <= 30) return 'Atenção';
                    return 'Crítico';
  }

  fetchFiltros() {
    this.clientesService.getFiltrosClientes()
      .subscribe({
        next: data => {
          this.cidades = data.cidades;
          this.statuses = data.status;
        },
        error: () => {

        }
      });
  }

  onAddCidade(term: string) {
    // ng-select passa a string digitada; inclui na lista (se não existir)
    if (term && !this.cidades.includes(term)) {
      this.cidades = [term, ...this.cidades];
    }
    this.formData.cidade = term;
  }

  onAddStatus(term: string) {
    if (term && !this.statuses.includes(term)) {
      this.statuses = [term, ...this.statuses];
    }
    this.formData.status = term;
  }

  onAddCampanha(term: string) {
    if (term && !this.listaCampanhas.includes(term)) {
      this.listaCampanhas = [term, ...this.listaCampanhas];
    }
    this.formData.campanha = term;
  }

  get isFechado(): boolean {
    return !!this.formData?.fechado;
  }

  toogleFecharCliente() {
    if (this.cliente) {
      this.cliente.fechado = this.cliente.fechado ? null : new Date();
      
      if( this.cliente.fechado) {
        this.cliente.status = null
      }

      this.clientesService.postCliente(this.cliente).subscribe({
        next: () => {
          Swal.fire('Sucesso!', 'Cliente fechado com sucesso.', 'success');
          this.onUpdate.emit();
          this.close();
        },
        error: (err: HttpErrorResponse) => {
          const mensagem = err.error?.error || 'Ocorreu um erro ao fechar o cliente.';
          Swal.fire('Erro!', mensagem, 'error');
        }
      });
    }
  }
}

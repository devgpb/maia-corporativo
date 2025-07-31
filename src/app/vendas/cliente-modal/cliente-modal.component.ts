import { HttpClient } from '@angular/common/http';
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
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnChanges, OnInit {
  @Input() cliente: Cliente;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave  = new EventEmitter<Cliente>();
  @Output() onUpdate = new EventEmitter<void>();
  cidades: string[] = [];
  listaCampanhas = [];

  constructor(
    private clientesService: ClientesService,
    private http: HttpClient,
  ){

  }
  fallbackCidades = ['Arcoverde', 'Buíque', 'Ibimirim', 'Tupanatinga', 'Custódia', 'Pesqueira', 'Venturosa', 'Manari', 'Inajá', 'Pedra'
  ]
  formData!: Cliente;
  errors: Record<string,string> = {};
  isLoading = false;

  /** Opções fixas de status (pode parametrizar/se passar dinâmico) */
  statuses = [
    'Aguardando','Curioso','Financiamento Reprovado','Desistência',
    'Sem Retorno','Adiado','Fechou Com Outra Empresa',
    'Fechado','Analisando Orçamento'
  ];

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['cliente'] && this.cliente) {
      this.formData = { ...this.cliente };
      this.errors = {};
      this.fetchCidades();
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

  fetchCidades() {
    this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/26/municipios')
      .subscribe({
        next: data => {
          this.cidades = data.map(c => c.nome);
        },
        error: () => {
          // Fallback: cidades da região de Arcoverde
          this.cidades = this.fallbackCidades
        }
      });
  }
}

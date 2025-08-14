import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges,
  OnInit
} from '@angular/core';
import { Cliente } from 'src/app/interfaces/ICliente';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';
// cliente-modal.component.ts (adicionar imports)
import moment from 'moment-timezone';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { VendasService } from 'src/app/services/vendas/vendas.service';


type EventoCard = {
  idEvento: number;
  idCliente: number;
  dataUTC: string;       // ISO UTC bruto
  dataLocal: string;     // formatado dd/MM/yyyy HH:mm
  evento?: string | null;
  confirmado?: boolean | null;
  _anim?: string;        // classe de animação (animate.css)
};


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

  // --- Eventos (estado UI) ---
  eventos: EventoCard[] = [];
  evTitulo = '';
  evData = null;       // YYYY-MM-DD (input date)
  evHora = '';          // HH:mm (input time, opcional)
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Maceio';
  isSavingEvento = false;
  isLoadingEventos = false;
  statuses: string[] = [];

  today = new Date();
  dpConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',
    adaptivePosition: true,
    showWeekNumbers: false,
  };

  constructor(
    private clientesService: ClientesService,
    private http: HttpClient,
    private vendasService: VendasService,
  ){

  }

  formData!: Cliente;
  errors: Record<string,string> = {};
  isLoading = false;



  ngOnChanges(ch: SimpleChanges): void {
    if (ch['cliente'] && this.cliente) {
      this.formData = { ...this.cliente };
      this.errors = {};
      this.carregarEventosCliente();
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
    this.listaCampanhas = this.clientesService.listaDeCampanhas;
    this.today.setHours(0, 0, 0, 0);
  }

  // (opcional) se o usuário digitar manualmente, clamp pra hoje
  onDateChange(d: Date | null) {
    if (!d) return;
    const picked = new Date(d);
    picked.setHours(0,0,0,0);
    if (picked < this.today) this.evData = this.today;
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

  private carregarEventosCliente() {
    this.isLoadingEventos = true;
    this.clientesService
      .getEventosDoCliente(this.cliente.idCliente, { tz: this.tz })
      .subscribe({
        next: (lista) => {
          this.eventos = (lista || []).map(e => ({
            idEvento: e.idEvento,
            idCliente: e.idCliente,
            dataUTC: e.data, // assumindo que a API devolve em UTC ISO em `data`
            dataLocal: e.dataLocal
              ? e.dataLocal
              : moment.utc(e.data).tz(this.tz).format('DD/MM/YYYY HH:mm'),
            evento: e.evento ?? null,
            confirmado: e.confirmado,
          }));
          this.isLoadingEventos = false;
        },
        error: () => { this.isLoadingEventos = false; }
      });
  }


  // monta ISO local -> UTC para enviar
  private montarISOParaAPI(): string | null {
    if (!this.evData) return null; // datepicker não selecionado
    const dia = moment(this.evData).format('YYYY-MM-DD');           // <- converte o Date do datepicker
    const hhmm = /^\d{2}:\d{2}$/.test(this.evHora || '') ? this.evHora! : '00:00';
    const local = moment.tz(`${dia}T${hhmm}`, this.tz);             // interpreta no fuso do usuário
    return local.isValid() ? local.utc().toISOString() : null;      // envia UTC para a API
  }

  marcarEvento() {
    const isoUTC = this.montarISOParaAPI();
    if (!isoUTC) {
      // @ts-ignore
      Swal.fire('Atenção', 'Selecione uma data válida.', 'warning');
      return;
    }
    this.isSavingEvento = true;

    this.clientesService.criarEvento({
      idCliente: this.cliente.idCliente,
      idUsuario: this.cliente.idUsuario,
      data: isoUTC,
      evento: this.evTitulo || null,
      tz: this.tz
    }).subscribe({
      next: (novo) => {
        const card: EventoCard = {
          idEvento: novo.idEvento,
          idCliente: this.cliente.idCliente,
          dataUTC: novo.data,
          dataLocal: novo.dataLocal
            ? novo.dataLocal
            : moment.utc(novo.data).tz(this.tz).format('DD/MM/YYYY HH:mm'),
          evento: novo.evento ?? null,
          confirmado: !!novo.confirmado,
          _anim: 'animate__animated animate__fadeIn'
        };
        // adiciona no topo
        this.carregarEventosCliente()

        // limpa inputs
        this.evTitulo = '';
        this.evData   = null;
        this.evHora = '';
        this.isSavingEvento = false;
      },
      error: (error) => {
        this.isSavingEvento = false;
        console.log(error.error.message)
        // @ts-ignore
        Swal.fire('Erro', error.error.message || 'Não foi possível marcar o evento.', 'error');
      }
    });
  }

  confirmarEventoLocal(ev: EventoCard) {
    ev.confirmado = true;
    // feedback visual rápido
    this.vendasService.confirmarEvento(ev.idEvento).subscribe({
      next: (novo) => {
        ev._anim = 'animate__animated animate__pulse';
        setTimeout(() => ev._anim = '', 500);
      },
      error: (error) => {
        this.isSavingEvento = false;
        Swal.fire('Erro', error.error.message || 'Não foi possível marcar o evento.', 'error');
      }
    });

  }

  cancelarEventoLocal(ev: EventoCard) {
    // @ts-ignore
    Swal.fire({
      title: 'Cancelar evento?',
      text: 'Esta ação removerá o evento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Não'
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.vendasService.cancelarEvento(ev.idEvento).subscribe({
      next: (novo) => {
        ev._anim = 'animate__animated animate__zoomOut';
        setTimeout(() => {
          this.eventos = this.eventos.filter(e => e.idEvento !== ev.idEvento);
          // Se depois criar rota de DELETE, chame-a aqui antes de remover do array.
        }, 250);
      },
      error: (error) => {
        this.isSavingEvento = false;
        Swal.fire('Erro', error.error.message || 'Não foi possível marcar o evento.', 'error');
      }
    });
    });
  }

  adjustHour(delta: number) {
    // se não houver hora, parte de 00:00
    const base = this.evHora && /^\d{2}:\d{2}$/.test(this.evHora) ? this.evHora : '00:00';
    const m = moment(base, 'HH:mm');
    if (!m.isValid()) return;
    m.add(delta, 'hour');
    // clamp 0–23 (moment já faz rollover; normalizamos)
    const h = (m.hours() + 24) % 24;
    const mm = m.minutes();
    this.evHora = `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  }

  mesmaData(ev1: EventoCard, ev2: EventoCard) {
    if (!ev1 || !ev2) return false;
    const d1 = ev1.dataLocal.split(' ')[0];
    const d2 = ev2.dataLocal.split(' ')[0];
    return d1 === d2;
  }

  private ordenarEventos() {
    // usa o UTC ISO para evitar ambiguidade de fuso/hora
    this.eventos.sort((a, b) =>
      moment.utc(b.dataUTC).valueOf() - moment.utc(a.dataUTC).valueOf()
    );
  }
}

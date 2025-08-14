import { Component, Input, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';

import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { VendasService, EventoUsuarioDTO } from 'src/app/services/vendas/vendas.service';

import moment from 'moment-timezone';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';

type ApiEvento = {
  idEvento: number;
  idUsuario?: number;
  data: string;              // UTC ISO vindo da API
  dataLocal?: string;        // opcional
  evento?: string | null;
  confirmado?: boolean | null;
  cliente?: { nome?: string | null } | null;
};

@Component({
  selector: 'app-event-agenda',
  templateUrl: './event-agenda.component.html',
  styleUrls: ['./event-agenda.component.scss'],
  standalone: false
})
export class EventAgendaComponent implements OnInit {

  user: IUser;

  loading = false;
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Maceio';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 'auto',
    locales: [ptBrLocale],
    locale: 'pt-br',
    timeZone: 'local', // mostra de acordo com o fuso do navegador
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false },
    events: [],

    eventClick: (info) => {
      const ev = info.event;
      const ext: any = ev.extendedProps || {};
      const status = ext.confirmado ? 'Confirmado' : 'Pendente';
      const cliente = ext.clienteNome ? `Cliente: ${ext.clienteNome}<br>` : '';
      Swal.fire({
        title: ev.title || 'Evento',
        html: `${cliente}Data/Hora: ${moment(ev.start!).format('DD/MM/YYYY HH:mm')}<br>Status: <b>${status}</b>`,
        icon: 'info'
      });
    },
  };

  constructor(
    private clientesService: ClientesService,
    private vendasService: VendasService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser()
  }

  ngOnInit(): void {
    this.loadEventos();
  }

  private loadEventos(): void {
    this.loading = true;
      console.log("lista")

    this.vendasService.getEventosUsuario(Number(this.user.idUsuario), { tz: this.tz })
      .subscribe({
        next: (lista) => {
          console.log(lista)
          const mapped: EventInput[] = (lista || []).map((e) => {
            const titlePart = e.evento ? e.evento : 'Evento';
            const clientePart = e.cliente?.nome ? ` - ${e.cliente?.nome}` : '';
            const startLocalISO = moment.utc(e.data).local().toISOString();
            return {
              id: String(e.idEvento),
              title: `${titlePart}${clientePart}${e.confirmado ? ' ✓' : ''}`,
              start: startLocalISO,
              allDay: false,
              classNames: [e.confirmado ? 'ev-confirmado' : 'ev-pendente'],
              extendedProps: {
                confirmado: !!e.confirmado,
                clienteNome: e.cliente?.nome || null
              }
            };
          });

          // seta os eventos no calendário
          this.calendarOptions = {
            ...this.calendarOptions,
            events: mapped
          };
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }
}

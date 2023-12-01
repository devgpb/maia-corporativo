import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import { ModalService } from '../services/modal/modal.service';
import { IDataEvento } from '../interfaces/IdataEnvento';

import { CalendarioService } from '../services/calendario/calendario.service';


@Component({
  selector: 'app-calendario-corporativo',
  templateUrl: './calendario-corporativo.component.html',
  styleUrls: ['./calendario-corporativo.component.scss']
})
export class CalendarioCorporativoComponent implements OnInit {

  eventoModal: IDataEvento | any = {}
  eventArray = [
    { title: 'Visita dona elena dos santos sobral',
    start: '2023-11-24T10:00:00',
    color: "red",
    local:{cep: "23245-234", rua: "rua joão de deus"},
    tipo:"VISITA",
    data:{data:"2023-11-24", hora: "10:00:00"} },
    { title: 'Evento 2', start: '2023-11-24T12:00:00' }
  ];

  constructor(
    private modalService: ModalService,
    private calendarioService: CalendarioService
  ) {

  }

  ngOnInit(): void {
      this.calendarioService.getEventos().subscribe(eventos => {
        this.eventArray = eventos
        this.atualizarEventosNoCalendario(eventos);
      })
  }

  atualizarEventosNoCalendario(eventos: any[]) {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: eventos
    };
  }

  calendarOptions: CalendarOptions = {
    initialView: window.innerWidth > 600 ? 'timeGridWeek' : 'timeGridDay',
    plugins: [dayGridPlugin,timeGridPlugin],
    locale: "pt-br",
    events:this.eventArray,
    themeSystem:"bootstrap5",
    aspectRatio:2,
    slotMinTime: '08:00:00',
    eventClick: (clickInfo) => {
      this.eventoModal = {
        local: clickInfo.event.extendedProps['local'],
        tipo: clickInfo.event.extendedProps['tipo'],
        data: clickInfo.event.extendedProps['data']
      }
      this.openModal()
    },
  };

  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return data.toLocaleDateString('pt-BR', options);
  }

  openModal() {
    this.modalService.show();
  }

  closeModal() {
    this.modalService.hide();
  }
}

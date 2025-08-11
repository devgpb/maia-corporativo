import { Component } from '@angular/core';
import { ptBrLocale } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { formatDate } from '@angular/common';
import * as moment from 'moment-timezone';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


import { EventosServce } from '../services/eventos/eventos.service';
import { AuthService } from '../services/auth/auth.service';
import { Cargos } from '../interfaces/IUser';

defineLocale('pt-br', ptBrLocale);

@Component({
    selector: 'app-novo-evento',
    templateUrl: './novo-evento.component.html',
    styleUrls: ['./novo-evento.component.scss'],
    standalone: false
})
export class NovoEventoComponent {
	public bsConfig: Partial<BsDatepickerConfig>;

  public eventForm: FormGroup;
  public formInvalid: boolean = false;

  constructor(
    private eventosService: EventosServce,
    private authService: AuthService,
    private fb: FormBuilder,
  ){

  }

  ngOnInit(): void {

    this.authService.cargosPermitidos([Cargos.ADMINISTRADOR,Cargos.GESTOR])

    this.eventForm = this.fb.group({
      nome: ['', Validators.required],
      data: ['', Validators.required],
      detalhes: ['', Validators.required],
      hora: [0, [Validators.required,Validators.min(0), Validators.max(23)]],
      minuto: [0, Validators.required],
    });

  }


  submit(){
    const dados = this.eventForm.value;
    const { hora, minuto, data, nome, detalhes } = dados;

    // Validação simplificada
    if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
        this.formInvalid = true;
        return;
    }

    this.formInvalid = false;

    // Configura a data e hora diretamente
    const dataEvento = new Date(data);
    dataEvento.setHours(hora, minuto, 0);

    // Cria o objeto evento
    const evento = {
        nome,
        data: dataEvento,
        detalhes
    };

    this.eventosService.setEvento(evento).subscribe(ret => {
      Swal.fire({
        icon: "success",
        title: "Evento Criado!",
        confirmButtonColor: "#3C58BF"
      });

      this.eventForm.reset()
    })
  }
}

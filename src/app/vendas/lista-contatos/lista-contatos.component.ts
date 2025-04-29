import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { VendasService } from 'src/app/services/vendas/vendas.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUser } from 'src/app/interfaces/IUser';
import * as moment from 'moment';

interface Contato {
  idSimulacao: string;
  nome: string;
  contato: string;
  custo: number;
  data: string;
  hora: string;
}

@Component({
  selector: 'app-lista-contatos',
  templateUrl: './lista-contatos.component.html',
  styleUrls: ['./lista-contatos.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'scale(0.8) rotate(10deg)' }))
      ])
    ])
  ]
})
export class ListaContatosComponent implements OnInit{
  contatos: Contato[] = [
  ];

  public user: IUser;

  constructor(
    private vendasService: VendasService,
    private authService: AuthService
  ){

  }

  carregarContatos(){
    this.vendasService.getContatos().subscribe(contatos =>{
      console.log(contatos)
      this.contatos = contatos
      this.contatos.forEach(contato => {
        contato.hora = moment(contato.hora, 'HH:mm').toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
    })
  }

  ngOnInit(): void {
    this.carregarContatos();
    this.user = this.authService.getUser()
  }

  removerContato(contato: any) {
    const dados = {
      ...contato,
      idAtendente: this.user.idUsuario
    }
    this.vendasService.marcarContato(dados).subscribe(()=>{
      this.carregarContatos();
    })
  }

  trackById(index: number, contato: Contato) {
    return contato.idSimulacao;
  }
}

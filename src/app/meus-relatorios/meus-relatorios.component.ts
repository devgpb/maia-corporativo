import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config/config.service';
import { RelatorioPessoalService } from '../services/relatorio-pessoal/relatorio-pessoal.service';
import { AuthService } from '../services/auth/auth.service';
import { IUser } from '../interfaces/IUser';

@Component({
    selector: 'app-meus-relatorios',
    templateUrl: './meus-relatorios.component.html',
    styleUrls: ['./meus-relatorios.component.scss'],
    standalone: false
})

export class MeusRelatoriosComponent implements OnInit {
  progress: number = 100;
  valorAtual: number = 0;
  meta: number = 0;
  progressHeight = 2;
  interval: any;
  user: IUser;

  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private relatorioPessoal: RelatorioPessoalService
  ){
    this.meta = config.getConfig().metaColaborador

    this.user = this.authService.getUser()
  }

  ngOnInit(): void {

    this.relatorioPessoal.getPedidosRealizados(this.user.idUsuario).subscribe( quant => {
      this.valorAtual = quant.quantidadePedidos
    })
   
  }

  calcularPorcentagem(): number {
    return Math.round((this.valorAtual / this.meta) * 100);
  }
  // determinarClasseCSS(): string {
  //   const porcentagem = this.calcularPorcentagem();
  //   if (porcentagem < 25) {
  //     return 'bg-danger'; // Vermelho para menos de 25%
  //   } else if (porcentagem < 50) {
  //     return 'bg-warning'; // Amarelo para menos de 50%
  //   } else if (porcentagem < 75) {
  //     return 'bg-info'; // Azul para menos de 75%
  //   } else {
  //     return 'bg-success'; // Verde para 75% ou mais
  //   }
  // }
  determinarCor(): string {
    const porcentagem = this.calcularPorcentagem();
    if (porcentagem < 25) {
      return '#ff0000'; // Vermelho para menos de 25%
    } else if (porcentagem < 50) {
      return '#ffcc00'; // Amarelo para menos de 50%
    } else if (porcentagem < 75) {
      return '#007bff'; // Azul para menos de 75%
    } else {
      return '#28a745'; // Verde para 75% ou mais
    }
  }
  calcularDashOffset(): number {
    const porcentagem = this.calcularPorcentagem();
    return 565 - (565 * porcentagem) / 100;
  }
}

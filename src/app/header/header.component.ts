import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentPage: string = 'pedidos';

  public userName: string = ''

	constructor (
		private router: Router,
    private authService: AuthService
	) {
		// this.user$ = userService.getUser();

		// Chamadas de funções por componentes externos
		// this.utils.externalComponentCalls.subscribe(
		// 	(call: IExternalCall) => {
		// 		if (call.externalFunction === ExternalFunction.SetCurrentPage)
		// 			this.currentPage = call.params;
		// 	}
		// );
	}

  ngOnInit(): void {
      this.userName = this.authService.getUser().nomeCompleto.split(' ')[0];
  }

	// public userName (user: IUser): string {
	// 	if (user.nome.indexOf(" ") != -1)
	// 		return user.nome.substring(0, user.nome.indexOf(" "));

	// 	return user.nome;
	// }

	public logout (): void {
		this.authService.logout();
	}
}

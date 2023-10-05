import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public currentPage: string = 'home';

	constructor (
		private router: Router,
		// private userService: UserService,
		// private utils: UtilsService
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

	// public userName (user: IUser): string {
	// 	if (user.nome.indexOf(" ") != -1)
	// 		return user.nome.substring(0, user.nome.indexOf(" "));

	// 	return user.nome;
	// }

	// public logout (): void {
	// 	this.userService.logout();
	// 	this.router.navigate(["login"]);
	// }
}

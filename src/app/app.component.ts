import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sistema Corporativo';
  public menuCollapsed: boolean = false;
	public isLogin: boolean = false;

	constructor (private router: Router) {
		// this.router.events.subscribe(_ => {
		// 	this.isLogin = this.router.url.substr(1).indexOf("login") === 0;
		// });
	}

	// public collapseChange (event: Event) {
	// 	this.menuCollapsed = event.;
	// }
}

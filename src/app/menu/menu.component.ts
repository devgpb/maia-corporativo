import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public userCargo = ""

    constructor(
      private authService:AuthService,
      private router: Router
    ){

      this.userCargo = this.authService.getUser().cargo

    }

    ngOnInit(): void {

    }

    // get function onlyShow(values: string[]){
    //   return values.indexOf(this.userCargo) > 0
    // }

    isActive(route: string): boolean {
      return this.router.url === route;
    }
}

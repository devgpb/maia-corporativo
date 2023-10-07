import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public userCargo = ""

    constructor(
      private authService:AuthService
    ){

      this.userCargo = this.authService.getUser().cargo

    }

    ngOnInit(): void {

    }

    // get function onlyShow(values: string[]){
    //   return values.indexOf(this.userCargo) > 0
    // }
}

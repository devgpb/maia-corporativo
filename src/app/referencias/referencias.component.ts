import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from "sweetalert2";
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { Cargos, IUser } from '../interfaces/IUser';
import { ReferenciasService } from '../services/referenciasService/referencias.service';
import { IReferencia } from '../interfaces/IReferencia';
import { UserService } from '../services/user/user.service';
@Component({
    selector: 'app-referencias',
    templateUrl: './referencias.component.html',
    styleUrls: ['./referencias.component.scss'],
    standalone: false
})
export class ReferenciasComponent implements OnInit {

  form: FormGroup;
  list: IUser[] | any[];

  constructor(
    private fb: FormBuilder,
    private refService:ReferenciasService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ){
    this.list = []
    this.form = this.fb.group({
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.cargosPermitidos([Cargos.ADMINISTRADOR,Cargos.GESTOR])
    this.userService.getAllUsuarios().subscribe(ref => {
      this.list = ref
    })
  }


  editar(ref: any){
    this.router.navigate([`/conta/editar/${ref.idUsuario}`])
  }

  apagar(ref:IUser){
    Swal.fire({
      title: 'Deseja mesmo apagar o usuário?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deletarUser(ref.idUsuario).subscribe(apagado =>{
          if(apagado){
            Swal.fire({
              icon: "success",
              title: "Usuario Apagado!",
              confirmButtonColor: "#3C58BF"
            });
            const index = this.list.indexOf(ref);
            this.list.splice(index,1)
          }else{
            Swal.fire({
              icon: "error",
              title: "Usuario Não Apagado!",
            });
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Usuario não foi apagado.', '', 'info');
      }
    });
  }


  copiarLink(codigo:string) {
    const link = `https://www.engemaia.com?ref=${codigo}`;

    // Usar a API do Clipboard para copiar o link
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        icon: "success",
        title: "Referencia Copiada!",
        text: "Ref: "+link,
        confirmButtonColor: "#3C58BF"
      });
    }).catch(err => {
      console.error('Falha ao copiar: ', err);
      Swal.fire({
        icon:"error",
        title: "Referencia Não Copiada!",
        text: "Mas seu link é: "+link,
      });
    });
  }
}

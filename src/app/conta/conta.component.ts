import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, Cargos } from '../interfaces/IUser';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class ContaComponent  implements OnInit {

  userForm: FormGroup = new FormGroup({});
  cargos = Object.values(Cargos);
  userInfo: IUser;
  initialFormValue: any;


  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private userService: UserService
  ){
    this.userInfo = this.authService.getUser()
  }

  nothingChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.userForm.value);
  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      nomeCompleto: [this.userInfo.nomeCompleto, Validators.required],
      dataNascimento: [this.userInfo.dataNascimento, Validators.required],
      setor: [this.userInfo.setor, Validators.required],
      email: [this.userInfo.email, [Validators.required, Validators.email]],
      cargo: [this.userInfo.cargo, [Validators.required]],
    });
    this.userForm.get('cargo')?.disable();
    this.userForm.get('setor')?.disable();
    this.initialFormValue = this.userForm.value;
  }

  onSubmit(): void {
    if (this.userForm.valid) {

      this.userService.atualizarUser(this.userForm.value,this.userInfo.idUsuario).subscribe(res =>{
        if(res){
          this.authService.updateUserData(this.userForm.value)
          this.userInfo = this.authService.getUser()
          Swal.fire({
            icon: "success",
            title: "Conta Atualizada!",
            confirmButtonColor: "#3C58BF"
          });
        }
      })
    }
  }
}


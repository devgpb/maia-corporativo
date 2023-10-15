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
    const nascmentoUser = new Date(this.userInfo.dataNascimento).toISOString().split('T')[0]

    this.userForm = this.fb.group({
      nomeCompleto: [this.userInfo.nomeCompleto, Validators.required],
      dataNascimento: [nascmentoUser, Validators.required],
      senhaAtual: [''],
      novaSenha: ['', [ Validators.minLength(8)]],
      setor: [this.userInfo.setor, Validators.required],
      email: [this.userInfo.email, [Validators.required, Validators.email]],
      cargo: [this.userInfo.cargo, [Validators.required]],
    }, {validator: this.checkPasswords });
    this.userForm.get('cargo')?.disable();
    this.userForm.get('setor')?.disable();
    this.initialFormValue = this.userForm.value;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('senhaAtual')?.value || '';
    let confirmPass = group.get('novaSenha')?.value || '';

    // Se ambas as senhas estiverem vazias, não retorne nenhum erro.
    if (!pass && !confirmPass) return null;

    // Se uma das senhas estiver vazia e a outra não, retorne um erro.
    if ((pass && !confirmPass) || (!pass && confirmPass)) {
      return { oneFieldEmpty: true };
    }

    // Se as senhas não forem iguais, retorne um erro.
    return null
  }


  onSubmit(): void {
    if (this.userForm.valid) {

      this.userService.atualizarUser(this.userForm.value,this.userInfo.idUsuario).subscribe(res =>{
        if(res){
          this.authService.updateUserData(this.userForm.value)
          this.userInfo = this.authService.getUser()
          this.userForm.get('senhaAtual')?.setValue('');
          this.userForm.get('novaSenha')?.setValue('');
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


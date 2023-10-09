import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, Cargos } from '../interfaces/IUser';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { SetoresService } from '../services/setores/setores.service';
import Swal from 'sweetalert2';
import { ISetor } from '../interfaces/ISetor';

@Component({
  selector: 'app-novo-user',
  templateUrl: './novo-user.component.html',
  styleUrls: ['./novo-user.component.scss']
})
export class NovoUserComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});
  list: ISetor[] = [];
  listCargos: any[] = []

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private setoresService: SetoresService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      idSetor: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      cargo: ['', [Validators.required]],
    });

    this.setoresService.getSetores().subscribe(ref => {
      this.list = ref;
    });

    this.userService.getCargos().subscribe(cargos =>{
      this.listCargos = cargos
    })
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      // Aqui você pode usar o método do serviço para cadastrar o usuário.
      this.userService.cadastrarUser(this.registerForm.value).subscribe(res => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Usuário Cadastrado!",
            confirmButtonColor: "#3C58BF"
          });
        }
      })
    }
  }
}

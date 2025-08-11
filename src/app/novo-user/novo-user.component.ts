import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, Cargos } from '../interfaces/IUser';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import { SetoresService } from '../services/setores/setores.service';
import Swal from 'sweetalert2';
import { ISetor } from '../interfaces/ISetor';
import * as Constantes from "../constants";

@Component({
    selector: 'app-novo-user',
    templateUrl: './novo-user.component.html',
    styleUrls: ['./novo-user.component.scss'],
    standalone: false
})
export class NovoUserComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});
  list: ISetor[] = [];
  listCargos: any[] = [];

  public listCidades: any[] = Constantes.cidades;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private setoresService: SetoresService
  ) {}

  ngOnInit(): void {

    this.authService.cargosPermitidos([Cargos.ADMINISTRADOR,Cargos.GESTOR])

    this.registerForm = this.fb.group({
      nomeCompleto: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      cidade: ["", Validators.required],
      idSetor: ["", Validators.required],
      celular: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
      cargo: ["", [Validators.required]],
    });

    this.setoresService.getSetores().subscribe(ref => {
      this.list = ref;
    });

    this.userService.getCargos().subscribe(cargos =>{
      if(this.authService.getCargo() != Cargos.ADMINISTRADOR){
        cargos = cargos.filter(cargo => cargo != "ADMINISTRADOR")
      }
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
          this.registerForm.reset()
        }
      },(error:any) => {
        Swal.fire({
          icon: "error",
          title: "Error: "+error.error.error,
          confirmButtonColor: "#3C58BF"
        });
      })
    }
  }

  applyCelularMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o celular
    value = value.substring(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
    event.target.value = value;
  }
}

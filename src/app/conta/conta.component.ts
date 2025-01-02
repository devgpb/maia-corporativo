import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, Cargos } from '../interfaces/IUser';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';
import Swal from 'sweetalert2';
import { EnderecoService } from '../services/enderecoService/endereco.service';
import { SetoresService } from '../services/setores/setores.service';
import { ActivatedRoute } from '@angular/router';
import { ISetor } from '../interfaces/ISetor';

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
  editando: boolean = false;
  userId: number | null = null;
  list: ISetor[] = [];
  listCargos: any[] = []


  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private enderecoService: EnderecoService,
    private setoresService: SetoresService,
    private route: ActivatedRoute,
    private userService: UserService
  ){
    this.inicializarForm()
    this.route.params.subscribe(params => {
      if(params['id']){
        this.userId = params['id'];
        this.authService.cargosPermitidos([Cargos.ADMINISTRADOR,Cargos.GESTOR])

        this.userService.getUser(this.userId).subscribe( user => {
          this.userInfo = user
          this.atualizarForm()
        })
        return
      }
      this.userInfo = this.authService.getUser()
      this.atualizarForm()

    });

  }

  nothingChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.userForm.value);
  }

  ngOnInit(): void {
    this.setoresService.getSetores().subscribe(ref => {
      this.list = ref;
    });

    this.userService.getCargos().subscribe(cargos =>{
      this.listCargos = cargos
    })
  }

  inicializarForm(){
    this.userForm = this.fb.group({
      nomeCompleto: ["", Validators.required],
      dataNascimento: ["", Validators.required],
      senhaAtual: [''],
      cpf: [""],
      cnpj: [""],
      celular: [""],
      novaSenha: ['', [ Validators.minLength(8)]],
      idSetor: ["", Validators.required],
      setor: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      cargo: ["", [Validators.required]],
      rua: [""],
      cidade: [""],
      bairro: [""],
      numero: [""],
      cep: [""],

    }, {validator: this.checkPasswords });
    this.userForm.get('cargo')?.disable();
    this.userForm.get('setor')?.disable();
    this.initialFormValue = this.userForm.value;
  }

  atualizarForm(){
    const nascmentoUser = new Date(this.userInfo.dataNascimento).toISOString().split('T')[0]
    this.userForm.patchValue({
      nomeCompleto: this.userInfo.nomeCompleto,
      dataNascimento: nascmentoUser,
      senhaAtual: '',
      cpf: this.userInfo.cpf,
      cnpj: this.userInfo.cnpj,
      idSetor: this.userInfo.idSetor,
      celular: this.userInfo.celular,
      setor: this.userInfo.setor,
      email: this.userInfo.email,
      cargo: this.userInfo.cargo,
      rua: this.userInfo.rua,
      cidade: this.userInfo.cidade,
      bairro: this.userInfo.bairro,
      numero: this.userInfo.numero,
      cep: this.userInfo.cep,

    });
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
      const id = this.userId ? this.userId : this.userInfo.idUsuario

      this.userService.atualizarUser(this.userForm.value, id as string).subscribe(res =>{
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

  applyCelularMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o celular
    value = value.substring(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
    event.target.value = value;
  }

  applyCpfMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 11 dígitos para o CPF
    value = value.substring(0, 11);

    // Aplica a máscara do CPF
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    event.target.value = value;
}

  applyCepMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 8 dígitos para o CEP
    value = value.substring(0, 8);

    value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca hífen após o quinto dígito
    event.target.value = value;
  }

  applyCnpjMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 14 dígitos para o CNPJ
    value = value.substring(0, 14);

    // Aplica a máscara do CNPJ
    value = value.replace(/(\d{2})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    event.target.value = value;
  }

  applyNomeMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\d/g, ''); // Remove tudo o que não for dígito

    event.target.value = value;
  }

  onCepChange() {
    const cep = this.userForm.get('cep')?.value;

    if (cep && cep.length == 9) { // Verifique se o CEP tem 8 dígitos
      this.enderecoService.buscaEnderecoPorCep(cep).subscribe((endereco: any) => {
        this.userForm.get('rua')?.setValue(endereco.logradouro);
        this.userForm.get('cidade')?.setValue(endereco.localidade);
      });
    }
  }
}


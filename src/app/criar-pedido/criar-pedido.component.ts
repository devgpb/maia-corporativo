import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { INovoPedido } from '../interfaces/INovoPedido';
import { EnderecoService } from '../services/enderecoService/endereco.service';
import { ReferenciasService } from '../services/referenciasService/referencias.service';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { IUser } from '../interfaces/IUser';

@Component({
  selector: 'app-criar-pedido',
  templateUrl: './criar-pedido.component.html',
  styleUrls: ['./criar-pedido.component.scss']
})
export class CriarPedidoComponent {
  public form!: FormGroup;

  public horarioSelecionado: string = "";
  public formInvalid: boolean = false;
  public ref = ''
  public user: IUser
  public referencias: any;

  public options = [
    { horario: 'manhã', label: 'Manhã' },
    { horario: 'tarde', label: 'Tarde' },
    { horario: 'noite', label: 'Noite' },
  ];

  fields = [
    {
      label: 'Cidade',
      type: 'text',
      placeholder: 'Informe a cidade',
      formControlName: 'cidade'
    },
    {
      label: 'CEP',
      type: 'text',
      placeholder: 'Informe o CEP',
      formControlName: 'cep',
      maskFunction: 'applyCepMask'
    },
    {
      label: 'Rua',
      type: 'text',
      placeholder: 'Informe a rua',
      formControlName: 'rua'
    },
    {
      label: 'Email',
      type: 'text',
      placeholder: 'Informe o email',
      formControlName: 'email'
    },
    ]

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private referenciasService: ReferenciasService,
    private pedidosService: PedidosService,
    private authService: AuthService
  ){
    this.form = this.initializeForm();
    this.referenciasService.getReferencias().subscribe(ref => {
      this.referencias = ref
    })
    this.user = this.authService.getUser()
  }

  private initializeForm(): FormGroup {
    let group: any = {};
    this.fields.forEach(field => {
      group[field.formControlName] = [''];
    });
    group['nome'] = ['', [Validators.required]];
    group['celular'] = ['', [Validators.required, Validators.minLength(12)]];
    group['consumo'] = [0];
    group['horario'] = ["tarde"];
    group['ref'] = [''];
    group['observacao'] = [''];
    group['email'] = ['', [this.emailValidator()]];

    return this.fb.group(group);
  }


  limparForm() {
    this.form.get("nome")?.setValue('')
    this.form.get("celular")?.setValue('')
    this.form.get("consumo")?.setValue('')
    this.form.get("cep")?.setValue('')
    this.form.get("rua")?.setValue('')
    this.form.get("cidade")?.setValue('')
    this.form.get("email")?.setValue('')
    this.form.get("horario")?.setValue('tarde')
    this.form.get("observacao")?.setValue('')
    this.form.get("ref")?.setValue('')

  }


  onSubmit(): void {

    if (this.form.valid) {

      const ref = this.user.idUsuario;

      const formContato: INovoPedido = {
        nomeCompleto: this.form.get("nome")?.value,
        celular: this.form.get("celular")?.value,
        consumoDeEnergiaMensal: this.form.get("consumo")?.value,
        cep: this.form.get("cep")?.value,
        rua: this.form.get("rua")?.value,
        cidade:this.form.get("cidade")?.value,
        email: this.form.get("email")?.value,
        horario: this.form.get("horario")?.value,
        observacao: this.form.get("observacao")?.value,
        referencia: ref,
      }

      this.formInvalid = false
      this.pedidosService.setPedido(formContato).subscribe(_ =>{
        Swal.fire({
          icon: "success",
          title: "Seu Pedido foi efetuado!",
          text: "Entraremos em Contato em Breve!",
          confirmButtonColor: "#3C58BF"
        });
        this.limparForm()
      }, (error:any)=> {
        Swal.fire({
          icon: "error",
          title: "Seu Pedido não efetuado!",
          text: "Por favor, entre em contato com o suporte!",
          confirmButtonColor: "#3C58BF"
        });
      })


    } else {
      console.warn('Formulário inválido');
      Swal.fire({
        icon: "error",
        title: "Seu Pedido não efetuado!",
        text: "Por favor, entre em contato com o suporte!",
        confirmButtonColor: "#3C58BF"
      });
      this.formInvalid = true
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

  applyCepMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito

    // Limita a 8 dígitos para o CEP
    value = value.substring(0, 8);

    value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca hífen após o quinto dígito
    event.target.value = value;
  }

  applyNomeMask(event: any): void {
    let value = event.target.value;
    value = value.replace(/\d/g, ''); // Remove tudo o que não for dígito

    event.target.value = value;
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;

      // Verifique se o campo está vazio (não é obrigatório)
      if (!email) {
        return null;
      }

      // Use uma expressão regular para validar o formato do email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(email);

      return valid ? null : { invalidEmail: true };
    };
  }

  onCepChange() {
    const cep = this.form.get('cep')?.value;

    if (cep && cep.length == 9) { // Verifique se o CEP tem 8 dígitos
      this.enderecoService.buscaEnderecoPorCep(cep).subscribe((endereco: any) => {
        this.form.get('rua')?.setValue(endereco.logradouro);
        this.form.get('cidade')?.setValue(endereco.localidade);
      });
    }
  }

}

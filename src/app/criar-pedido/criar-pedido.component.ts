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
      label: 'Endereco',
      type: 'text',
      placeholder: 'Informe o endereco',
      formControlName: 'endereco'
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
  ) {
    this.form = this.initializeForm();
    this.referenciasService.getReferencias().subscribe(ref => {
      this.referencias = ref
    })
    this.user = this.authService.getUser()
  }

  private initializeForm(): FormGroup {
    let group: any = {};
    this.fields.forEach(field => {
      group[field.formControlName] = [null];
    });
    group['nomeCompleto'] = [null, [Validators.required]];
    group['celular'] = [null, [Validators.required, Validators.minLength(12)]];
    group['consumo'] = [null];
    group['ref'] = [null];
    group['ref'] = [null];
    group['profissao'] = [null];
    group['observacao'] = [null];
    group['email'] = [null];
    group['cpfCliente'] = [null];
    group['comprovanteResidencia'] = [null];
    group['identidade'] = [null];
    group['comprovanteResidenciaOpt'] = [null];


    group['kit'] = [null];
    group['valorProjeto'] = [null];


    return this.fb.group(group);
  }


  limparForm() {
    this.form.reset()
  }


  onSubmit(): void {

    if (this.form.valid) {

      const ref = this.user.idUsuario;

      const formData = new FormData();
      Object.keys(this.form.value).forEach(key => {
        const value = this.form.get(key)?.value;

        // Se for array de File, faz um loop
        if (Array.isArray(value) && value.length && value[0] instanceof File) {
          value.forEach((file: File) => {
            formData.append(key, file);
          });
        }
        // Se for arquivo único
        else if (value instanceof File) {
          formData.append(key, value);
        }
        // Se for texto normal
        else {
          formData.append(key, value || '');
        }
      });

     
      this.formInvalid = false
      this.pedidosService.setPedido(formData).subscribe(_ => {
        Swal.fire({
          icon: "success",
          title: "Seu Pedido foi efetuado!",
          text: "Entraremos em Contato em Breve!",
          confirmButtonColor: "#3C58BF"
        });
        // this.limparForm()
      }, (error: any) => {
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

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EnderecoService } from '../../services/enderecoService/endereco.service';
import { ReferenciasService } from '../../services/referenciasService/referencias.service';
import { PedidosService } from '../../services/pedidos/pedidos.service';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../interfaces/IUser';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-final-pedido',
  templateUrl: './form-final-pedido.component.html',
  styleUrls: ['./form-final-pedido.component.scss']
})
export class FormFinalPedidoComponent {
  public form!: FormGroup;

  public horarioSelecionado: string = "";
  public formInvalid: boolean = false;
  public ref = ''
  public user: IUser
  public referencias: any;
  public bsConfig: any;
  public idCliente: any;
  public hashCliente: string = null;
  public pedido: any;

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private referenciasService: ReferenciasService,
    private pedidosService: PedidosService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.hashCliente = params['hash'];
      this.pedidosService.getPedidoHash(this.hashCliente).subscribe((pedido: any) => {
        this.idCliente = pedido.idPedido
        this.pedido = pedido
        this.form.get('idPedido')?.setValue(this.idCliente)

      });
    });

    this.form = this.initializeForm();
    this.referenciasService.getReferencias().subscribe(ref => {
      this.referencias = ref
    })


    this.bsConfig = {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      maxDate: new Date(),
      locale: 'pt-br'
    };


    this.user = this.authService.getUser()
  }

  private initializeForm(): FormGroup {
    let group: any = {};
    // this.fields.forEach(field => {
    //   group[field.formControlName] = [null];
    // });
    group['idPedido'] = [null, [Validators.required]];
    group['dataInicioInstalacao'] = [null, [Validators.required]];
    group['dataFimInstalacao'] = [null, [Validators.required]];

    group['fotosPlacas'] = [null, [Validators.required]];
    group['fotosInversor'] = [null, [Validators.required]];
    group['fotosExtra'] = [null, [Validators.required]];
    group['observacao'] = [null];



    return this.fb.group(group);
  }


  limparForm() {
    this.form.reset()
  }


  onSubmit(): void {

    if (this.form.valid) {

      Swal.fire({
        title: 'Carregando...',
        text: 'Aguarde enquanto processamos sua requisição.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

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
      this.pedidosService.finalizarPedido(formData).subscribe(_ => {
        Swal.close();

        Swal.fire({
          icon: "success",
          title: "Seu Pedido foi Finalizado!",
          confirmButtonColor: "#3C58BF"
        });
        // this.limparForm()
      }, (error: any) => {
        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Seu Pedido não foi finalizado!",
          text: "Erro: " + (error?.error?.message || error?.message || 'Erro de rede'),
          confirmButtonColor: "#3C58BF"
        });
      })


    } else {
      Swal.close();

      console.warn('Formulário inválido');
      Swal.fire({
        icon: "error",
        title: "Seu Pedido não foi finalizado!",
        text: "Formulário está inválido!",
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

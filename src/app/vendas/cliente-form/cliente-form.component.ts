import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IUser } from 'src/app/interfaces/IUser';

@Component({
    selector: 'app-cliente-form',
    templateUrl: './cliente-form.component.html',
    standalone: false
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  cidades: string[] = [];
  user: IUser;
  statusList: string[] = [
  'Aguardando',
  'Curioso',
  'Financiamento Reprovado',
  'Desistência',
  'Sem Retorno',
  'Adiado',
  'Fechou Com Outra Empresa',
  'Fechado',
  'Analisando Orçamento',
  'Visita Marcada'
  ];

  listaCampanhas = []

  fallbackCidades = ['Arcoverde', 'Buíque', 'Ibimirim', 'Tupanatinga', 'Custódia', 'Pesqueira', 'Venturosa', 'Manari', 'Inajá', 'Pedra'
  ]
  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private clientesService: ClientesService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser()
  }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      celular: ['', Validators.required],
      cidade: [''],
      status: [''],
      indicacao: [''],
      campanha: [''],
      observacao: [''],
    });

    this.listaCampanhas = this.clientesService.listaDeCampanhas

    this.fetchCidades();
  }



  fetchCidades() {
  this.http.get<any[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/26/municipios')
    .subscribe({
      next: data => {
        this.cidades = data.map(c => c.nome);
      },
      error: () => {
        // Fallback: cidades da região de Arcoverde
        this.cidades = this.fallbackCidades
      }
    });
}

  onSubmit() {
    if (this.clienteForm.valid) {

      const cliente = {
        ...this.clienteForm.value,
        idUsuario: this.user.idUsuario,
      }
      this.clientesService.postCliente(cliente).subscribe(
        {
          next: () => {
            // Sucesso
            // @ts-ignore
            Swal.fire('Sucesso!', 'Cliente cadastrado com sucesso.', 'success');
            this.clienteForm.reset();
          },
          error: (err: HttpErrorResponse) => {
            // pega a mensagem que o seu endpoint retornou em { error: "..." }
            const mensagem = err.error?.error || 'Ocorreu um erro ao cadastrar o cliente.';
            Swal.fire('Erro!', mensagem, 'error');
          }
        }
      )
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }
}

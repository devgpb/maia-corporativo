import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  cidades: string[] = [];
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
  ];

  listaCampanhas = []

  fallbackCidades = ['Arcoverde', 'Buíque', 'Ibimirim', 'Tupanatinga', 'Custódia', 'Pesqueira', 'Venturosa', 'Manari', 'Inajá', 'Pedra'
  ]
  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private clientesService: ClientesService
  ) {}

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
      console.log(this.clienteForm.value);
      this.clientesService.postCliente(this.clienteForm.value).subscribe(
        {
          next: () => {
            // Sucesso
            // @ts-ignore
            Swal.fire('Sucesso!', 'Cliente cadastrado com sucesso.', 'success');
            this.clienteForm.reset();
          },
          error: () => {
            // Erro
            // @ts-ignore
            Swal.fire('Erro!', 'Ocorreu um erro ao cadastrar o cliente.', 'error');
          }
        }
      )
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }
}

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
  statusList: string[] = [];
  public readonly PHONE_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;

  listaCampanhas = []



  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private clientesService: ClientesService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser()
  }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      nome: [null, Validators.required],
      celular: [null, [Validators.required, Validators.pattern(this.PHONE_REGEX)]],
      cidade: [null],
      status: [null],
      indicacao: [null],
      campanha: [null],
      observacao: [null],
    });

    this.listaCampanhas = this.clientesService.listaDeCampanhas

    this.fetchFiltros();
  }

  // (opcional) atalho pra usar no template
  get f() { return this.clienteForm.controls; }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
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

  }

  fetchFiltros() {
    this.clientesService.getFiltrosClientes()
      .subscribe({
        next: data => {
          this.cidades = data.cidades;
          this.statusList = data.status;
        },
        error: () => {
        }
      });
  }

  onAddCidade(term: string) {
    // ng-select passa a string digitada; inclui na lista (se não existir)
    if (term && !this.cidades.includes(term)) {
      this.cidades = [term, ...this.cidades];
    }
    this.clienteForm.get('cidade').setValue(term);

  }

  onAddStatus(term: string) {
    if (term && !this.statusList.includes(term)) {
      this.statusList = [term, ...this.statusList];
    }
    this.clienteForm.get('status').setValue(term);
  }

  onAddCampanha(term: string) {
    if (term && !this.listaCampanhas.includes(term)) {
      this.listaCampanhas = [term, ...this.listaCampanhas];
    }
    this.clienteForm.get('campanha').setValue(term);
  }
}

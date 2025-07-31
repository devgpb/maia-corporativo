// lista-clientes.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/ICliente';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  carregandoBusca = false;
  searchTerm = '';
  statusFilter = 'todos';
  cidadeFilter = 'todas';
  sortBy = 'recente';
  statusUnicos: string[] = [];
  cidadesUnicas: string[] = [];

  selectedCliente: Cliente | null = null;
  isModalOpen = false;

  constructor(
    private clientesService: ClientesService,
    private modalService: ModalService
  ) {

  }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(
      (clientes) => {
        this.clientes = clientes
        this.atualizaFiltros();
      }
    )
    this.carregarFiltros();
    this.carregarClientesRecentes();
  }


  carregarFiltros() {
    this.clientesService.getFiltrosClientes().subscribe(data => {
      console.log(data)
      this.statusUnicos = data.status || [];
      this.cidadesUnicas = data.cidades || [];
    });
  }

  carregarClientesRecentes() {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.atualizaFiltros();
    });
  }

  atualizaFiltros(): void {
    let lista = this.clientes.filter(cliente => {
      const termo = this.searchTerm.toLowerCase();
      const matchesSearch =
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.idCliente.toString().includes(termo) ||
        cliente.celular.includes(this.searchTerm) ||
        (cliente.cidade && cliente.cidade.toLowerCase().includes(termo)) ||
        (cliente.campanha && cliente.campanha.toLowerCase().includes(termo)) ||
        (cliente.status && cliente.status.toLowerCase().includes(termo));

      const matchesStatus =
        this.statusFilter === 'todos' ||
        (cliente.status && cliente.status.toLowerCase() === this.statusFilter.toLowerCase());

      const matchesCidade =
        this.cidadeFilter === 'todas' ||
        (cliente.cidade && cliente.cidade.toLowerCase() === this.cidadeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCidade;
    });

    // ordena
    lista = lista.slice().sort((a, b) => {
      switch (this.sortBy) {
        case 'recente':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'antigo':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'id':
          return a.idCliente - b.idCliente;
        default:
          return 0;
      }
    });

    this.clientesFiltrados = lista;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'todos';
    this.cidadeFilter = 'todas';
    this.atualizaFiltros();
  }


  /** abre o modal e carrega o cliente */
  openModal(cliente: Cliente) {
    this.selectedCliente = { ...cliente };
    this.modalService.show();
  }

  /** fecha o modal e limpa o cliente */
  closeModal() {
    this.modalService.hide();
    this.selectedCliente = null;
  }

  /** salva localmente as alterações */
  saveChanges() {
    if (!this.selectedCliente) return;
    const updated = this.selectedCliente;
    const idx = this.clientes.findIndex(c => c.idCliente === updated.idCliente);
    if (idx > -1) {
      this.clientes[idx] = { ...updated };
      this.atualizaFiltros();
    }
    this.closeModal();
  }


  pesquisaAvancada() {
    this.carregandoBusca = true;
    this.clientesService.getClientes({
      search: this.searchTerm,
      status: this.statusFilter,
      cidade: this.cidadeFilter,
      sortBy: this.sortBy
    }).subscribe(clientes => {
      this.clientesFiltrados = clientes;
      this.carregandoBusca = false;
    }, () => this.carregandoBusca = false);
  }

  atualizar() {
    this.closeModal();
    this.carregarClientesRecentes();
  }
}

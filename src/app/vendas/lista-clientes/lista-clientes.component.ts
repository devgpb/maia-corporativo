// lista-clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/ICliente';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css'],
  standalone: false
})
export class ListaClientesComponent implements OnInit {
  clientes: Cliente[] = [];              // dados da página atual
  total = 0;                             // total geral
  totalPages = 1;                        // páginas totais
  page = 1;                              // página atual
  pageSize = 50;                         // itens por página

  user: IUser;
  carregandoBusca = false;

  // filtros
  searchTerm = '';
  statusFilter = 'todos';
  cidadeFilter = 'todas';
  sortBy = 'recente';
  statusUnicos: string[] = [];
  cidadesUnicas: string[] = [];
  meusClientes = new FormControl(false);

  // modal
  selectedCliente: Cliente | null = null;
  public isModalOpen = false;

  constructor(
    private clientesService: ClientesService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.carregarFiltros();
    this.fetch(); // primeira carga
  }

  private buildParams(extra: any = {}) {
    const base: any = {
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
    };

    if (this.meusClientes.value) base.idUsuario = this.user.idUsuario;

    // se veio de busca avançada, acrescenta filtros
    if (extra.fromSearch) {
      base.search = this.searchTerm;
      base.status = this.statusFilter;
      base.cidade = this.cidadeFilter;
    }

    return { ...base, ...extra };
  }

  carregarFiltros() {
    this.clientesService.getFiltrosClientes().subscribe(data => {
      this.statusUnicos = data.status || [];
      this.cidadesUnicas = data.cidades || [];
    });
  }

  /** Busca padrão (recentes) usando a paginação atual */
  fetch() {
    this.carregandoBusca = true;
    this.clientesService.getClientes(this.buildParams()).subscribe({
      next: (resp) => {
        this.clientes = resp.data;
        this.total = resp.meta.total;
        this.totalPages = resp.meta.totalPages;
        this.carregandoBusca = false;
      },
      error: () => (this.carregandoBusca = false),
    });
  }

  /** Busca com filtros (botão "Buscar na base") */
  pesquisaAvancada() {
    this.page = 1; // sempre recomeça da primeira página
    this.carregandoBusca = true;

    this.clientesService.getClientes(this.buildParams({ fromSearch: true })).subscribe({
      next: (resp) => {
        this.clientes = resp.data;
        this.total = resp.meta.total;
        this.totalPages = resp.meta.totalPages;
        this.carregandoBusca = false;
      },
      error: () => (this.carregandoBusca = false),
    });
  }

  /** Muda page e recarrega (mantém filtros se estiver filtrando) */
  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;

    // se há filtros ativos (exceto "todos/todas" e busca vazia), refaz busca avançada
    const filtrando =
      !!this.searchTerm ||
      this.statusFilter !== 'todos' ||
      this.cidadeFilter !== 'todas' ||
      !!this.meusClientes.value;

    filtrando ? this.pesquisaAvancada() : this.fetch();
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
    const filtrando =
      !!this.searchTerm ||
      this.statusFilter !== 'todos' ||
      this.cidadeFilter !== 'todas' ||
      !!this.meusClientes.value;

    filtrando ? this.pesquisaAvancada() : this.fetch();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'todos';
    this.cidadeFilter = 'todas';
    this.meusClientes.setValue(false);
    this.page = 1;
    this.fetch();
  }

  // modal
  openModal(cliente: Cliente) {
    this.selectedCliente = { ...cliente };
    this.modalService.show();
  }
  closeModal() {
    this.modalService.hide();
    this.selectedCliente = null;
  }
  saveChanges() {
    if (!this.selectedCliente) return;
    const updated = this.selectedCliente;
    const idx = this.clientes.findIndex(c => c.idCliente === updated.idCliente);
    if (idx > -1) this.clientes[idx] = { ...updated };
    this.closeModal();
  }

  atualizar() {
    this.closeModal();
    // mantém contexto atual (página/filtros)
    const filtrando =
      !!this.searchTerm ||
      this.statusFilter !== 'todos' ||
      this.cidadeFilter !== 'todas' ||
      !!this.meusClientes.value;

    filtrando ? this.pesquisaAvancada() : this.fetch();
  }

  get startIndex(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    if (this.total === 0) return 0;
    return Math.min(this.page * this.pageSize, this.total);
  }

}

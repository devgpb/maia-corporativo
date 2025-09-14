import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/ICliente';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { LigacoesService } from 'src/app/services/ligacoes/ligacoes.service';

@Component({
  selector: 'app-lista-ligacoes',
  templateUrl: './lista-ligacoes.component.html',
  styleUrls: ['./lista-ligacoes.component.scss'],
  standalone: false
})
export class ListaLigacoesComponent implements OnInit {
  clientes: Cliente[] = [];
  total = 0;
  totalPages = 1;
  page = 1;
  pageSize = 50;
  quantidade: number = 10; // alternativa rápida de tamanho de lista (padrão 10)

  user: IUser;
  carregando = false;

  // filtros
  searchTerm = '';
  statusFilter = 'todos';
  cidadeFilter = 'todas';
  sortBy = 'recente';
  statusUnicos: string[] = [];
  cidadesUnicas: string[] = [];
  meusClientes = new FormControl(false);
  dia = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  // novo filtro: por padrão, ocultar clientes já ligados hoje
  excluirLigadosHoje = true;

  // ids que estão saindo com fade
  removing = new Set<number>();
  // observações por cliente
  observacoes: Record<number, string> = {};

  constructor(
    private clientesService: ClientesService,
    private ligacoesService: LigacoesService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.carregarFiltros();
    // Não carregar automaticamente; usuário deve pesquisar
  }

  private buildParams(extra: any = {}) {
    const base: any = {
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      dia: this.dia,
      excluirLigadosHoje: this.excluirLigadosHoje,
    };
    if (this.quantidade && this.quantidade > 0) base.quantidade = this.quantidade;
    if (this.meusClientes.value) base.idUsuario = this.user.idUsuario;
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

  fetch() {
    this.carregando = true;
    this.ligacoesService.getClientesParaLigacao(this.buildParams()).subscribe({
      next: (resp) => {
        this.clientes = resp.data;
        this.total = resp.meta.total;
        this.totalPages = resp.meta.totalPages;
        this.carregando = false;
      },
      error: () => (this.carregando = false),
    });
  }

  pesquisaAvancada() {
    this.page = 1;
    this.carregando = true;
    this.ligacoesService.getClientesParaLigacao(this.buildParams({ fromSearch: true })).subscribe({
      next: (resp) => {
        this.clientes = resp.data;
        this.total = resp.meta.total;
        this.totalPages = resp.meta.totalPages;
        this.carregando = false;
      },
      error: () => (this.carregando = false),
    });
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    // sempre exige pesquisa explícita
    this.pesquisaAvancada();
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
    // não buscar automaticamente; requer clique em "Buscar"
  }

  changeQuantidade(qtd: number) {
    this.quantidade = Number(qtd) || 10;
    this.page = 1;
    // não buscar automaticamente; requer clique em "Buscar"
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'todos';
    this.cidadeFilter = 'todas';
    this.meusClientes.setValue(false);
    this.excluirLigadosHoje = true;
    this.page = 1;
    // Não buscar automaticamente; limpa resultados
    this.clientes = [];
    this.total = 0;
    this.totalPages = 1;
  }

  marcarLigacao(cliente: Cliente, atendido: boolean) {
    if (!cliente?.idCliente) return;
    const id = cliente.idCliente as unknown as number;
    this.removing.add(id);
    const observacao = this.observacoes[id];
    this.ligacoesService.marcarLigacao({ idCliente: id, dia: this.dia, atendido, observacao }).subscribe({
      next: () => {
        // faz fade-out e remove
        setTimeout(() => {
          this.clientes = this.clientes.filter(c => c.idCliente !== cliente.idCliente);
          this.removing.delete(id);
          // atualiza contadores da paginação
          this.total = Math.max(this.total - 1, 0);
          delete this.observacoes[id];
        }, 350);
      },
      error: () => {
        this.removing.delete(id);
      }
    });
  }

  pularCliente(cliente: Cliente) {
    if (!cliente?.idCliente) return;
    const id = cliente.idCliente as unknown as number;
    this.removing.add(id);
    // apenas remove localmente (não persiste no servidor)
    setTimeout(() => {
      this.clientes = this.clientes.filter(c => c.idCliente !== cliente.idCliente);
      this.removing.delete(id);
      this.total = Math.max(this.total - 1, 0);
      delete this.observacoes[id];
    }, 350);
  }

  abrirWhatsapp(cliente: Cliente, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const celularRaw = cliente?.celular || '';
    const celularLimpo = celularRaw.replace(/\D/g, '');
    if (!celularLimpo) return;
    const celularComDDI = celularLimpo.startsWith('55') ? celularLimpo : `55${celularLimpo}`;

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

    const url = isMobile
      ? `https://wa.me/${celularComDDI}?app_absent=0`
      : `https://web.whatsapp.com/send?phone=${celularComDDI}&type=phone_number&app_absent=0`;

    window.open(url, '_blank');
  }

  get startIndex(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }
  get endIndex(): number {
    if (this.total === 0) return 0;
    return Math.min(this.page * this.pageSize, this.total);
  }
}

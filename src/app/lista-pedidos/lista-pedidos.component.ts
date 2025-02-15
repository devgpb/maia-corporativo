import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPedido } from '../interfaces/IPedido';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { AuthService } from '../services/auth/auth.service';
import { ModalService } from '../services/modal/modal.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss']
})
export class ListaPedidosComponent implements OnInit {
  pedidos: IPedido[] = [];
  pedidoSelecionado: IPedido | undefined;

  private refreshSubscription!: Subscription;

  // Parâmetros para filtro, pesquisa e paginação
  detalhe: string = '';
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  configuracao: any = {};

  user: any;

  constructor(
    private pedidosService: PedidosService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    // Lê o parâmetro "detalhe" da URL e carrega os pedidos
    this.route.paramMap.subscribe(params => {
      this.detalhe = params.get('detalhe') || '';
      this.currentPage = 1; // reinicia a página ao mudar o detalhe
      switch (this.detalhe) {
        case "arts":
          this.configuracao = {
            title: "Arts a fazer",
            icon: "fa-solid fa-pen",
            pesquisa:{
              detalhes:{
                ART: false,
                equipamentoComprado: true,
                pagamentoRealizado: true
              }
            },
            updates: {
              detalhes: {
                ART: true
              }
            }
          };
          break;
        case "pagamentos":
          this.configuracao = {
            title: "Pagamentos a confirmar",
            icon: "fa-solid fa-money-bill",
            pesquisa:{
              detalhes:{
                pagamentoRealizado: false
              }
            },
            updates: {
              detalhes: {
                pagamentoRealizado: true
              }
            }
          };
          break;

        case "equipamentos":
          this.configuracao = {
            title: "Equipamentos a comprar",
            icon: "fa-solid fa-box",
            pesquisa:{
              detalhes:{
                equipamentoComprado: false,
                pagamentoRealizado: true
              }
            },
            updates: {
              detalhes: {
                equipamentoComprado: true,
                espelho: true
              }
            }
          };
          break;
          case "homologacoes":
          this.configuracao = {
            title: "Homologações Pendentes",
            icon: "fa-solid fa-folder-open",
            pesquisa:{
              detalhes:{
                equipamentoComprado: true,
                pagamentoRealizado: true,
                ART: true,
                homologado: false
              }
            },
            updates: {
              detalhes: {
                homologado: true
              }
            }
          };
          break;
          case "instalar":
          this.configuracao = {
            title: "Pendende Instalação",
            icon: "fa-solid fa-cog",
            pesquisa:{
              detalhes:{
                equipamentoComprado: true,
                pagamentoRealizado: true,
              }
            },
            updates: {
              detalhes: {
                status: "INSTALACAO"
              }
            }
          };
          break;
        default:
          break;
      }
      this.carregarPedidos();

       // Configura o refresh automático a cada 1 minuto (60000 ms)
      this.refreshSubscription = interval(30000).subscribe(() => {
        console.log("Atualizando pedidos...");
        this.carregarPedidos();
      });
    });

  }

  /**
   * Chama o serviço para buscar os pedidos usando o filtro
   * (aqui enviamos o detalhe e o termo de pesquisa para o backend)
   */
  carregarPedidos(): void {
    this.configuracao
    const filter = this.configuracao?.pesquisa || {};
    console.log(filter)

    this.pedidosService.getPedidosFilter(filter)
      .subscribe(pedidos => {
        this.pedidos = pedidos;
        this.totalPages = Math.ceil(this.pedidos.length / this.pageSize);
      });
  }

  /**
   * Retorna os pedidos da página atual (paginação feita no front-end)
   */
  get paginatedPedidos(): IPedido[] {
    // Filtra os pedidos se houver um termo de busca
    let filteredPedidos = this.pedidos;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.normalize(this.searchTerm);
      filteredPedidos = this.pedidos.filter(pedido => {
        // Substitua "nome" pelo campo que deseja filtrar, se necessário
        return this.normalize(pedido.nomeCompleto).includes(term);
      });
    }

    // Atualiza a quantidade total de páginas com base nos itens filtrados
    this.totalPages = Math.ceil(filteredPedidos.length / this.pageSize);

    // Calcula os índices de início e fim para a paginação
    const start = (this.currentPage - 1) * this.pageSize;
    return filteredPedidos.slice(start, start + this.pageSize);
  }


  /**
   * Altera o tamanho da página e recalcula a paginação
   */
  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.pedidos.length / this.pageSize);
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  atualizaDetalhes(pedido: IPedido){
    this.pedidosService.updatePedido(pedido.idPedido, this.configuracao.updates).subscribe(resp => {
      pedido["animating"] = true;
      setTimeout(() => {
        this.pedidos = this.pedidos.filter((p) => p !== pedido);
      }, 500)
    })
  }

  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  /**
   * Acionado quando o usuário clica no botão de pesquisar.
   * Recarrega os pedidos com o filtro de pesquisa.
   */
  onSearch(): void {
    this.currentPage = 1;
    // this.carregarPedidos();
  }

  /**
   * Abre o modal para edição do pedido. O método é chamado
   * quando o card (card-cliente) emite o evento de clique.
   */
  abrirEdicao(pedido: IPedido): void {
    this.pedidoSelecionado = pedido;
    this.modalService.toggle();
  }
}

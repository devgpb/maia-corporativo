export interface IDashboardVendas {
  clientesNovosHoje: number;
  clientesAtendidosHoje: number;
  totalClientesCadastrados: number;
  clientesPendentes: number;
  orcamentosEnviados: number;
  clientesExpansao: number;
  statusDistribution: Array<{ status: string; count: number }>;
  campanhaDistribution: Array<{ campanha: string; count: number }>;
  clientesRecentes: Array<{
    idCliente: number;
    nome: string;
    celular: string;
    cidade: string;
    status: string;
    createdAt: string;
    ultimoContato: string | null;
    orcamentoEnviado: boolean;
  }>;
  clientesSemContato: Array<{
    idCliente: number;
    nome: string;
    celular: string;
    status: string;
    diasSemContato: number;
  }>;
}

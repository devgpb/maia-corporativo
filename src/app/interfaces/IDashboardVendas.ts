export interface IDashboardVendas {
  clientesNovosHoje: number;
  clientesAtendidosHoje: number;
  totalClientesCadastrados: number;
  clientesPendentes: number;
  orcamentosEnviados: number;
  clientesExpansao: number;
  eventosMarcados: number;
  clientesFechados: number;
  statusDistribution: Array<{ status: string; count: number }>;
  campanhaDistribution: Array<{ campanha: string; count: number }>;

}

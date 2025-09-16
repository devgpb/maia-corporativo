export interface IContatoPorDia {
  /** yyyy-MM-dd no fuso do servidor (TZ) */
  date: string;
  count: number;
}

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

  /** NOVO: contatos (ultimoContato) por dia no intervalo */
  contatosPorDia: IContatoPorDia[];

  /** NOVO: total de ligações efetuadas no período */
  ligacoesEfetuadas: number;

  /** NOVO: ligações por dia no intervalo */
  ligacoesPorDia?: IContatoPorDia[];
}

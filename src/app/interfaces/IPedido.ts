export interface IPedido{
  [key: string]: any;
  idPedido?: string | number;
  nomeCompleto: string;
  consumo: number;
  faturamento?: number;
  cpfCliente?: string;
  formaPagamento?: string;

  celular : string;
  endereco: string;
  email : string;
  horario: string;
  ref: string;
  dataPedido: string | Date;
  observacao?: string;
  status: string;
  indicacao: string;

  datas: any;

  detalhes:any;
  instalacao: any;
  pagamento: any;

  selected?: boolean;
}


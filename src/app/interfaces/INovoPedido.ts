export interface INovoPedido{
  [key: string]: any;
  idPedido?: string | number;
  nomeCompleto: string;
  consumoDeEnergiaMensal: number;
  celular : string;
  endereco: string;
  email : string;
  horario: string;
  referencia: string;
  observacao?: string;
  dataPedido?: string;
  status?: string;
  indicacao?: string;
}


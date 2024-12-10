export interface INovoPedido{
  [key: string]: any;
  idPedido?: string | number;
  nomeCompleto: string;
  consumo: number;
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


export interface IPedido{
  [key: string]: any;
  idPedido?: string | number;
  nomeCompleto: string;
  consumoDeEnergiaMensal: number;
  celular : string;
  cep : string;
  rua : string;
  cidade: string;
  email : string;
  horario: string;
  ref: string;
  dataPedido: string;
}


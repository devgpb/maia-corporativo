// Tipagem de dados para Cliente
export interface Cliente {
  idCliente: number;
  nome: string;
  celular: string;
  cidade?: string;
  status?: string;
  indicacao?: string;
  campanha?: string;
  observacao?: string;
  fechado?: Date | string;
  idPedido?: number;
  responsavel? : {
    nomeCompleto?: string,
    idUsuario?: number
  }
  ultimoContato?: Date | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

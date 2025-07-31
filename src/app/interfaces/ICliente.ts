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
  idPedido?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

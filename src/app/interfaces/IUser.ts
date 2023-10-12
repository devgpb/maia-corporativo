export interface IUser{
  nomeCompleto: string;
  idUsuario: string;
  dataNascimento: Date;
  idSetor: number;
  setor: string;
  email: string;
  cargo: string;
}

export enum Cargos{
  GESTOR = "GESTOR",
  ADMINISTRADOR = "ADMINISTRADOR",
  COLABORADOR = "COLABORADOR"
}

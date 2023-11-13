export interface IUser{
  nomeCompleto: string;
  idUsuario: string;
  cpf?: string;
  cnpj?: string;
  dataNascimento: Date;
  idSetor: number;
  setor: string;
  email: string;
  celular?: string;
  cargo: string;

  cep?: string;
  rua?: string;
  cidade?: string;
  numero?: string;
  bairro?: string;

}

export enum Cargos{
  GESTOR = "GESTOR",
  ADMINISTRADOR = "ADMINISTRADOR",
  COLABORADOR = "COLABORADOR"
}

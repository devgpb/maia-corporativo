export interface IUser{
  idUsuario: string;
  dataNascimento: Date;
  idSetor: number;
  email: string;
  cargo: string;
}

enum Cargos{
  "GESTOR",
  "ADMINISTRADOR",
  "COLABORADOR"
}

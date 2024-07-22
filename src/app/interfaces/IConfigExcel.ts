interface Chave {
  key: string;
  name: string;
  tipo?: string;
}

export interface IConfigExcel {
  dados: any[];
  titulo: string;
  descricao: string;
  chaves: Chave[];
}

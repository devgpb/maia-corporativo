interface Chave {
  key: string;
  name: string;
}

export interface IConfigExcel {
  dados: any[];
  titulo: string;
  descricao: string;
  chaves: Chave[];
}

export interface IDataEvento{
  title: string,
  start: Date,
  local:{
    cep:string,
    rua:string,
    numero:string
  },
  tipo: string,
  data: {
    data:string,
    hora:string
  }
}

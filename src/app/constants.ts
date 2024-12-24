export const pedidos = ["FECHADO", "ART", "HOMOLOGAR", "INSTALACAO", "FINALIZADO"];

// titulos = pedidos com primeira letra maiuscula
// export const titulos: { [key: string]: string } = {
//   "prospectados":"Prospectados",
//   "apresentacao":"Em Apresentação",
//   "acompanhamento": "Acompanhamento",
//   "interessado":"Clientes Interessados",
//   "engatilhado":"Venda Engatilhada",
//   "fechado":"Pedidos Fechados",
//   "instalacao": "Etapada De Instalação",
//   "finalizados":"Finalizados"}
const titulos = pedidos.map(pedido => pedido.charAt(0).toUpperCase() + pedido.slice(1).toLowerCase())

export const descricoesStatus: { [key: string]: string } = {
    "prospectados":"Um cliente prospectado acabou de chegar, ainda não foi estabelecido uma ligação com ele. É a nossa primeira etapa de funil.",
    "apresentacao":"Em fase de apresentação, onde deve-se enviar uma proposta comercial e agendar uma visita.",
    "engatilhado": "A fase onde o cliente está decidido e está se desenvolvendo para assinar o contrato",
    "interessado": "A fase onde o cliente ainda está decidindo sua aquisição, ele pode não responder, ou até mesmo desistir da compra",
    "negociacao":"A entapa que define o processo de realizar a visita, definir o financiamento e assinar o contrato. Não esqueça de marcar no pedido quando a visita for realizada e o orçamento for gerado",
    "fechado":"Contrato assinado, hora de comprar o material, acompanhar o pedido e realizar a homolocagação ",
    "instalacao": "Compreende as etapas de instalação, FALTA INSTALAR, INSTALANDO e INSTALADO",
    "finalizados":"Todos os pedidos finalizados com sucesso"}

export const rotasPedidos = pedidos.map((estado) => estado.toLowerCase());

export const rotasEspeciais =
["standby","perdidos"]

export const todasRotas = [...pedidos, "STANDBY", "PERDIDO"]

export const tiposPagamentos = ["À VISTA", "FINANCIADO"]

export const dtlanguage = {
  processing: "Processando...",
  search: "Pesquisar:",
  lengthMenu: "Mostrar _MENU_ registros por página",
  info: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
  infoEmpty: "Mostrando 0 até 0 de 0 registros",
  infoFiltered: "(filtrado de _MAX_ registros no total)",
  infoPostFix: "",
  loadingRecords: "Carregando registros...",
  zeroRecords: "Nenhum registro encontrado",
  emptyTable: "Nenhuma dado disponível na tabela",
  paginate: {
    first: "Primeiro",
    previous: "Anterior",
    next: "Seguinte",
    last: "Último"
  },
  aria: {
    sortAscending: ": ativar para ordenar a coluna em ordem ascendente",
    sortDescending: ": ativar para ordenar a coluna em ordem descendente"
  }
}

export const mapaEquipamentos = {
  placa: "marca modelo potencia",
  inversor:"marca modelo corrente potencia"
}

export const tiposSuportes = [
  "FIBROCIMENTO",
  "SOLO",
  "CERÂMICO",
  "METÁLICO"
]

export const AvisosAvanco = {
  "FECHADO":"Você tem certeza que o contrato já foi gerado?",
  "ART":"Você tem certeza que a ART já foi gerada e assinada?",
  "HOMOLOGAR":"Você tem certeza que a homologação já foi realizada?",
  "INSTALACAO":"Você tem certeza já preencheu o formulário de finalização de instalação?",
}


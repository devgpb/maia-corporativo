export const pedidos = ['PROSPECTADO', 'APRESENTACAO', 'ACOMPANHAMENTO', 'NEGOCIACAO', 'FECHADO', 'INSTALACAO', 'FINALIZADO']

export const titulos: { [key: string]: string } = {
  "prospectados":"Prospectados",
  "apresentacao":"Em Apresentação",
  "acompanhamento": "Acompanhamento",
  "negociacao":"Em Negociação",
  "fechado":"Fechado",
  "instalacao": "Etapada De Instalação",
  "finalizados":"Finalizados"}

export const descricoesStatus: { [key: string]: string } = {
    "prospectados":"Um cliente prospectado acabou de chegar, ainda não foi estabelecido uma ligação com ele. É a nossa primeira etapa de funil.",
    "apresentacao":"Em fase de apresentação, onde deve-se enviar uma proposta comercial e agendar uma visita.",
    "acompanhamento": "A fase onde o cliente ainda está decidindo sua aquisição, ele pode não responder, ou até mesmo desistir da compra",
    "negociacao":"A entapa que define o processo de realizar a visita, definir o financiamento e assinar o contrato. Não esqueça de marcar no pedido quando a visita for realizada e o orçamento for gerado",
    "fechado":"Contrato assinado, hora de comprar o material, acompanhar o pedido e realizar a homolocagação ",
    "instalacao": "Compreende as etapas de instalação, FALTA INSTALAR, INSTALANDO e INSTALADO",
    "finalizados":"Todos os pedidos finalizados com sucesso"}

export const rotasPedidos =
["prospectados","apresentacao","acompanhamento","negociacao","fechado","instalacao","finalizados"]


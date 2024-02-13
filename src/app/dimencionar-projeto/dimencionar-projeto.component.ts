import { Component, OnInit } from '@angular/core';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import { mapaEquipamentos } from '../constants';

@Component({
  selector: 'app-dimencionar-projeto',
  templateUrl: './dimencionar-projeto.component.html',
  styleUrls: ['./dimencionar-projeto.component.scss']
})
export class DimencionarProjetoComponent implements OnInit {

  mapaEquipamentos = mapaEquipamentos

  inversor = null
  placa = null

  dimensionamento: any;

  equipamentos: any = {
    inversores: [],
    placas: []
  };

  constructor(private equipamentosService: EquipamentosService){

  }

  ngOnInit(): void {
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip
    })
  }

  dimencionar(){
    // this.equipamentosService.getDimencionamento({inversor:this.inversor, placa: this.placa}).subscribe(dimen => {
    //   this.dimensionamento = dimen
    // })
    const placaQ = this.transformarEquipamento("placa",this.placa) as any
    const inversorQ = this.transformarEquipamento("inversor",this.inversor) as any
    const disjuntor = this.dimensionarDisjuntor(this.extrairNumero(inversorQ.corrente))

    const potenciaInversorW = this.extrairNumero(inversorQ.potencia) * 1000; // Convertendo de kW para W, se necessário
    const potenciaPlacaW = this.extrairNumero(placaQ.potencia);
    const placasMaximas = Math.floor(potenciaInversorW / potenciaPlacaW);

    this.dimensionamento = {
      placasMaximas : placasMaximas,
      disjuntor : disjuntor,
      bitola : this.dimensionarBitola(disjuntor),
    }

    console.log(
      placaQ,inversorQ,disjuntor,this.dimensionamento,
      {Ppotencia:this.extrairNumero(inversorQ.potencia)},{Ipotencia:this.extrairNumero(placaQ.potencia)}
    )
  }



  transformarEquipamento(tipo, valorString) {
    // Verificar se o tipo de equipamento existe no mapa
    if (!this.mapaEquipamentos[tipo]) {
        throw new Error(`Tipo de equipamento desconhecido: ${tipo}`);
    }

    // Dividir a string de propriedades com base nos espaços
    const propriedades = valorString.split(' ');

    // Dividir a string de chaves do mapaEquipamentos com base nos espaços
    const chaves = this.mapaEquipamentos[tipo].split(' ');

    // Verificar se a quantidade de propriedades corresponde
    if (propriedades.length !== chaves.length) {
        throw new Error(`Quantidade de propriedades não corresponde para o tipo ${tipo}`);
    }

    // Criar o objeto de equipamento com as chaves e valores correspondentes
    let objetoEquipamento = {};
    for (let i = 0; i < chaves.length; i++) {
        objetoEquipamento[chaves[i]] = propriedades[i];
    }

    return objetoEquipamento;
  }

  extrairNumero(str) {
    // Encontra todos os dígitos e pontos na string
    const resultado = str.match(/(\d+\.?\d*)/g); // Modificado para incluir pontos
    // Pega o último match (que deve ser o número com a parte decimal, se houver)
    const ultimoMatch = resultado ? resultado[resultado.length - 1] : null;
    // Converte para número ou retorna null se não houver dígitos
    return ultimoMatch ? parseFloat(ultimoMatch) : null;
  }

  dimensionarDisjuntor(valor) {
    const disjuntores = [16, 20, 25, 32, 40, 50, 63, 70, 80, 100];
    console.log("\n\n\n\n" + valor)
    // Encontrar o menor disjuntor que é maior ou igual ao valor
    const disjuntorEscolhido = disjuntores.find(disjuntor => disjuntor >= valor);

    // Se nenhum disjuntor for suficiente, retornar null ou um valor padrão
    return disjuntorEscolhido !== undefined ? disjuntorEscolhido : null;
  }

  dimensionarBitola(corrente) {
    // Mapeamento da corrente máxima (A) para a bitola do cabo (mm²)
    const tabelaBitola = [
        { correnteMaxima: 12, bitola: 1.0 },
        { correnteMaxima: 15, bitola: 1.5 },
        { correnteMaxima: 21, bitola: 2.5 },
        { correnteMaxima: 28, bitola: 4.0 },
        { correnteMaxima: 36, bitola: 6.0 },
        { correnteMaxima: 50, bitola: 10.0 },
        { correnteMaxima: 68, bitola: 16.0 },
        { correnteMaxima: 89, bitola: 25.0 },
        { correnteMaxima: 111, bitola: 35.0 },
        { correnteMaxima: 134, bitola: 50.0 },
        { correnteMaxima: 171, bitola: 70.0 },
        { correnteMaxima: 207, bitola: 95.0 },
        { correnteMaxima: 240, bitola: 120.0 },
        { correnteMaxima: 310, bitola: 185.0 },
        { correnteMaxima: 365, bitola: 240.0 },
        { correnteMaxima: 420, bitola: 300.0 },
        { correnteMaxima: 500, bitola: 400.0 },
        { correnteMaxima: 580, bitola: 500.0 },
        // Preencha com mais dados conforme necessário
    ];

    // Encontrar a bitola do cabo que corresponde à corrente maior ou igual à fornecida
    const bitolaEscolhida = tabelaBitola.reduce((acc: any, item) => {
        if (item.correnteMaxima >= corrente) {
            return acc.bitola && acc.bitola < item.bitola ? acc : item;
        }
        return acc;
    }, {});

    // Retorna a bitola do cabo se encontrado, senão retorna null ou um valor padrão
    return bitolaEscolhida.bitola || null;
  }
}

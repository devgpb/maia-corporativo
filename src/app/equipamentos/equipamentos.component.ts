import { Component, OnInit } from '@angular/core';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import { eq } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-equipamentos',
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.scss']
})
export class EquipamentosComponent implements OnInit{

  nome: string;
  marca: string;

  cadastrado = undefined;
  alertHandler = undefined;

  equip = {
    placa: {
      marca: "",
      potencia: ""
    },
    inversor:{
      marca: "",
      modelo: "",
      corrente: "",
      potencia: "",
    }
  }

  equipMap = {
    placa: {
      marca: "",
      potencia: ""
    },
    inversor:{
      marca: "",
      modelo: "",
      corrente: "",
      potencia: "",
    }
  }

  tipo = "placa";

  constructor(private equipamentoService: EquipamentosService){}

  ngOnInit(): void {

  }

  adicionarEquipamento(){



    const equipamento = {
      nome: this.gerarNomeEquip(),
      tipo: this.tipo
    }

    if(equipamento.nome == " "){
      this.cadastrado = false
      setInterval(() => {
        this.alertHandler = true
      }, 3000);
      return
    }

    this.equipamentoService.postEquipamento(equipamento).subscribe(resp => {
      if(resp.nome){
        this.cadastrado = true
      }else{
        this.cadastrado = false
      }
      this.equip = {...this.equipMap}
      setInterval(() => {
        this.alertHandler = true
      }, 3000);
    })
  }


  gerarNomeEquip(){
    if(this.tipo == 'placa'){
      const placa = this.equip.placa

      return `${placa.marca.trim()} ${placa.potencia.trim().replace(/,/g, '.')}W`
    }else if(this.tipo == 'inversor'){
      const inv = this.equip.inversor

      return `${inv.marca.trim()} ${inv.modelo.trim()} ${inv.corrente.trim().replace(/,/g, '.')}A ${inv.potencia.trim().replace(/,/g, '.')}KW`
    }

    return null;
  }

  mudarTipo(tipo: string){
    this.tipo = tipo
  }

  validarNumero(event: KeyboardEvent) {
    // Permitir apenas dígitos numéricos
    if (!/[0-9.,]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
}

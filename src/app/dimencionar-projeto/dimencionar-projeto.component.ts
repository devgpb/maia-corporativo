import { Component, OnInit } from '@angular/core';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';

@Component({
  selector: 'app-dimencionar-projeto',
  templateUrl: './dimencionar-projeto.component.html',
  styleUrls: ['./dimencionar-projeto.component.scss']
})
export class DimencionarProjetoComponent implements OnInit {


  inversor = ''
  placa = ''

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
    this.equipamentosService.getDimencionamento({inversor:this.inversor, placa: this.placa}).subscribe(dimen => {
      console.log(dimen)
    })
  }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import { DataTableDirective } from 'angular-datatables';
import { eq } from '@fullcalendar/core/internal-common';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import * as Constantes from "../constants";
import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-equipamentos',
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.scss']
})
export class EquipamentosComponent implements OnInit{

  nome: string;
  marca: string;
  listaEquipamentos = []

  @ViewChild("equips", { read: DataTableDirective, static: true })
	private dataTableEquips: DataTableDirective;
	public dtOptionsEquips: DataTables.Settings = { };
  public dtTriggerEquips: Subject<any> = new Subject();
  public user: any;

  cadastrado = undefined;
  alertHandler = undefined;

  equip = {
    placa: {
      marca: "",
      potencia: "",
      modelo: "",
      garantiaFabricacao: "",
      garantiaPerformance: "",
    },
    inversor:{
      marca: "",
      modelo: "",
      corrente: "",
      potencia: "",
      garantiaFabricacao: "",
    }
  }

  equipMap = {
    ...this.equip
  }

  private _tipo = "placa";

  constructor(
    private equipamentoService: EquipamentosService,
    private authService: AuthService
  ){
    this.dtOptionsEquips = {
      language: Constantes.dtlanguage,
			lengthMenu: [60, 30],
			stateSave: true,
      ordering: true,
      processing: true,
      searching: true,
		};

    this.user = this.authService.getUser()
  }

  ngOnInit(): void {
    // Inicializa 'tipo' com valor do Local Storage ou valor padrão
    this._tipo = localStorage.getItem('tipo') || this._tipo;

    this.carregarTabela()
  }

  carregarTabela(){
     // Destruir a DataTable atual antes de recarregar os novos dados
     if (this.dataTableEquips?.dtInstance) {
      this.dataTableEquips.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.equipamentoService.getTiposEquipamentos(this.tipo).subscribe(equip => {
          this.listaEquipamentos = equip
          this.dtTriggerEquips.next(equip);
        })
      });
    } else {
      // Se a DataTable ainda não foi inicializada, basta emitir os novos dados
      this.equipamentoService.getTiposEquipamentos(this.tipo).subscribe(equip => {
        this.listaEquipamentos = equip
        this.dtTriggerEquips.next(equip);
      })
    }
  }

  // Getter e Setter para 'tipo'
  set tipo(value: string) {
    this._tipo = value;
    localStorage.setItem('tipo', value);
  }

  get tipo(): string {
    return localStorage.getItem('tipo') || this._tipo;
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
        this.listaEquipamentos.push(resp)
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

      return `${placa.marca.trim()} ${placa.modelo.trim()} ${placa.potencia.trim().replace(/,/g, '.')}W`
    }else if(this.tipo == 'inversor'){
      const inv = this.equip.inversor

      return `${inv.marca.trim()} ${inv.modelo.trim()} ${inv.corrente.trim().replace(/,/g, '.')}A ${inv.potencia.trim().replace(/,/g, '.')}KW`
    }

    return null;
  }

  mudarTipo(tipo: string){
    this.tipo = tipo
    this.carregarTabela()
  }

  validarNumero(event: KeyboardEvent) {
    // Permitir apenas dígitos numéricos
    if (!/[0-9.,]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  removerEquipamento(equip: any){
    // confirmação swal
    Swal.fire({
      icon: "error",
      title: 'Tem certeza que deseja excluir este equipamento?',
      showCancelButton: true,
      confirmButtonText: `Sim`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipamentoService.deleteEquipamento(equip.idEquipamento).subscribe(resp =>{
          this.listaEquipamentos = this.listaEquipamentos.filter(e => e.idEquipamento !== equip.idEquipamento);
        })
      }
    })
  }

  iniciarEdicao(equip: any) {
    equip.isEditing = true;
    equip.editNome = equip.nome; // Guardar o nome original em caso de cancelamento
  }

  salvarEquipamento(equip: any) {
    this.equipamentoService.postEquipamento(equip).subscribe(resp => {
      equip.isEditing = false;
    });
  }

  cancelarEdicao(equip: any) {
    equip.nome = equip.editNome; // Restaurar o nome original
    equip.isEditing = false;
  }

}

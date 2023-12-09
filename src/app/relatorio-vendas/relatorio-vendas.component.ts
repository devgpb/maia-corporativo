import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";
import { BsDaterangepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { RelatoriosGerenciaisService } from '../services/relatorios-gerenciais/relatorios-gerenciais.service';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import * as moment from "moment";
import { formatDate } from '@angular/common';
import { UtilsService } from '../services/utils/utils.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-relatorio-vendas',
  templateUrl: './relatorio-vendas.component.html',
  styleUrls: ['./relatorio-vendas.component.scss']
})
export class RelatorioVendasComponent implements OnInit {

	public searchForm: FormGroup;
	public validations: IValidations;
	public bsConfig: Partial<BsDaterangepickerConfig>;
	public periodos: Array<{ id: number, nome: string }>;
	private flagChange: boolean = false;


  public inicioRelatorio: string = "";
  public fimRelatorio: string = "";

  public valoresFixos = {
    taxaConversaoGeral: 0,
    taxaConversaoOrcamento: 0,
  }

  public tabelas = {
    temposMedios: [],
    quantidadeStatus: []
  }

  // GRAFICOS

  // Perfomance
  public performanceChartType: ChartType = 'bar';
  public performanceOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public performanceBarChart: ChartData<'bar'> = {
    labels: [], // Nomes dos usuários
    datasets: [
      { data: [], label: 'Total de Pedidos' },
    ]
  };

  public carregarPerformance(data) {
    // Novos dados para o gráfico
    const novosDados: ChartData<'bar'> = {
      labels: data.map(item => item.nomeUsuario), // Nomes dos usuários
      datasets: [
        { data: data.map(item => item.totalPedidos), label: 'Total de Pedidos' },
      ]
    };

    // Atualizar a referência do objeto performanceBarChart para desencadear a detecção de mudanças
    this.performanceBarChart = { ...novosDados };
  }

  public pedidosPordiaOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
  };
  public pedidosPordiaType: ChartType = 'bar';
  public pedidosPordiaData: ChartData<'bar'> = {
    labels: [], // datas
    datasets: [
      { data: [],
        label: 'Quantidade de Pedidos',
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Azul claro para fundo
        borderColor: 'rgba(54, 162, 235, 1)', // Azul mais escuro para borda
        borderWidth: 1
      },

    ]
  };

  carregarpedidosPordia(dados) {
    this.pedidosPordiaData.labels = dados.map(d => d.data);
    this.pedidosPordiaData.datasets[0].data = dados.map(d => +d.quantidadePedidos);
  }

  carregarTempoMedsioStatus(dados){

    for (let chave in dados) {
      if (dados.hasOwnProperty(chave)) {
        const partes = chave.split('_PARA_');
        const novoObjeto = {
          de: partes[0].toUpperCase(),
          para: partes[1].toUpperCase(),
          dias: dados[chave]
        };
        this.tabelas.temposMedios.push(novoObjeto);
      }
    }

  }

  ngOnInit(): void {
    this.relatoriosService.getRelatorioGeral().subscribe(resp => {
      console.log(resp)
      this.carregarPerformance(resp.performanceUsuarios)
      this.carregarpedidosPordia(resp.quantidadePedidosPorDia)
      this.valoresFixos.taxaConversaoGeral = resp.taxaConversaoPedidos.taxaFloat
      this.valoresFixos.taxaConversaoOrcamento = resp.analiseOrcamento.taxaConversaoNumerico
      this.carregarTempoMedsioStatus(resp.tempoMedioPorStatus)
      this.tabelas.quantidadeStatus = resp.listaPedidosPorStatus
      console.log(this.tabelas.quantidadeStatus)

    })
  }

  constructor(
		private formBuilder: FormBuilder,
		private utils: UtilsService,
    private relatoriosService: RelatoriosGerenciaisService,
    private localeService: BsLocaleService,

  ){
    this.bsConfig = {
			isAnimated: true,
			containerClass: "theme-dark-blue",
			maxDate: new Date(),
			showWeekNumbers: false,
			selectFromOtherMonth: true
		};

		this.localeService.use("pt-br");

    this.periodos = this.utils.getPeriods();

    this.searchForm = this.formBuilder.group({
			datas: [[moment().startOf("month").toDate(), moment().endOf("month").toDate()], Validators.required],
			periodo: [null],
		});

    this.validations = {
			form: this.searchForm,
			fields: {
				datas: [{ key: "required" }]
			}
		};

    this.searchForm.get("datas").valueChanges.subscribe(
			_ => {
				if (!this.flagChange && this.searchForm.get("periodo").value)
					this.searchForm.get("periodo").setValue(null);
				else
					this.flagChange = false;
			}
		);
  }



  public search(){
    const dateRange = this.searchForm.value.datas;

    const dataInicio = moment(this.searchForm.get("datas").value[0]).format("YYYY-MM-DD");
    const dataFim = moment(this.searchForm.get("datas").value[1]).format("YYYY-MM-DD");

    const showInicio = dataInicio.split("-")
    const showFim = dataFim.split("-")

  }

  public get periodoTitle (): string {
		return this.utils.ngSelectTitle(
			this.searchForm.get("periodo")!,
			this.periodos,
			"id",
			"nome",
			"Personalizado"
		);
	}

  public periodChanged () {
		if (!this.searchForm.get("periodo").value && this.searchForm.get("periodo").value !== 0)
			return;

		this.flagChange = true;
		if (this.searchForm.get("periodo").value == 12) {
			this.searchForm.get("datas").setValue([
				moment().subtract(11, "months").startOf("month").toDate(),
				moment().endOf("month").toDate()
			]);
		} else {
			this.searchForm.get("datas").setValue([
				moment().subtract(this.searchForm.get("periodo").value, "months").startOf("month").toDate(),
				moment().subtract(this.searchForm.get("periodo").value, "months").endOf("month").toDate()
			]);
		}
	}





}



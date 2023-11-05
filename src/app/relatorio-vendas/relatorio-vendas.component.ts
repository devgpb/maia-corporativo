import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";
import { BsDaterangepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { RelatoriosGerenciaisService } from '../services/relatorios-gerenciais/relatorio-pessoal.service';

import * as moment from "moment";
import { formatDate } from '@angular/common';
import { UtilsService } from '../services/utils/utils.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-relatorio-vendas',
  templateUrl: './relatorio-vendas.component.html',
  styleUrls: ['./relatorio-vendas.component.scss']
})
export class RelatorioVendasComponent {

	public searchForm: FormGroup;
	public validations: IValidations;
	public bsConfig: Partial<BsDaterangepickerConfig>;
	public periodos: Array<{ id: number, nome: string }>;
	private flagChange: boolean = false;


  public inicioRelatorio: string = "";
  public fimRelatorio: string = "";

  public relatorioRSA = undefined;


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

    this.relatoriosService.getRelatorioRSA(dataInicio,dataFim).subscribe(resp => {
      this.relatorioRSA = resp
      this.inicioRelatorio = `${showInicio[2]}/${showInicio[1]}`
      this.fimRelatorio = `${showFim[2]}/${showFim[1]}`
    })
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


  async copyReportToClipboard() {
    const textToCopy = this.getTextToCopy();
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        Swal.fire({
          icon: "success",
          title: "Relatório Copiado para a área de transferência!",
          confirmButtonColor: "#3C58BF"
        });
      } catch (err) {
        Swal.fire({
          icon:"error",
          title: "Relatório Não Copiado!",
          text: "Tente copiar manualmente",
        });
        console.error('Falha ao copiar: ', err);
      }
    }
  }

  private getTextToCopy(): string {
    // Aqui você constrói o texto que deseja copiar
    const lines = [
      `RSA - Método Infinity Solar🌞`,
      `Período ${this.inicioRelatorio} a ${this.fimRelatorio}`,
      `Leads captados Método Infinity Solar:  ${this.relatorioRSA.pedidosTrafegoPago}`,
      `Orçamentos gerados: ${this.relatorioRSA.orcamentosGerados}`,
      `Quantidade vendas realizadas: ${this.relatorioRSA.pedidosFinalizado}`,
      `Faturamento das vendas:`,
      `Vendas engatilhadas: ${ this.relatorioRSA.vendasEngatilhadas }`,
      `Lead caiu no whatsapp(sem querer/por engano): ${this.relatorioRSA.pedidosEngano}`,
      `Não respondeu whatsapp: ${this.relatorioRSA.pedidosSemRespostas}`,
      ` Orçamentos em kWh média: ${this.relatorioRSA.mediaConsumoEnergia}`,
    ];
    return lines.join('\n\n'); // Junta todas as linhas com quebra de linha
  }
}



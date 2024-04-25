import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import Swal from "sweetalert2";

import { IDropdownSettings } from "ng-multiselect-dropdown";
import { UserService } from "../user/user.service";

export enum ExternalFunction {
	RerenderMenu = "rerenderMenu",
	SetCurrentPage = "setCurrentPage"
}

export interface IExternalCall {
	externalFunction: ExternalFunction;
	params?: any;
}

export interface ITimeFieldValidator {
	canBeEmpty?: boolean;
	smallerControl?: string;
	biggerControl?: string;
	triggerControl?: string;
	smallerThenDiference?: string[];
}

@Injectable({ providedIn: "root" })
export class UtilsService {
	public externalComponentCalls: Subject<IExternalCall> = new Subject();

	constructor (
		private userService: UserService,
		private router: Router
	) { }

	public getDataTablesTranslation (emptyLabel: string = "Nenhum registro"): DataTables.LanguageSettings {
		return {
			emptyTable: emptyLabel,
			info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
			infoEmpty: "Mostrando 0 até 0 de 0 registros",
			infoFiltered: "(Filtrados de _MAX_ registros)",
			infoPostFix: "",
			thousands: ".",
			lengthMenu: "_MENU_ resultados por página",
			loadingRecords: "Carregando...",
			processing: "Processando...",
			zeroRecords: "Nenhum registro encontrado",
			search: "Pesquisar:",
			paginate: {
				next: "Próximo",
				previous: "Anterior",
				first: "Primeiro",
				last: "Último"
			},
			aria: {
				sortAscending: ": Ordenar colunas de forma ascendente",
				sortDescending: ": Ordenar colunas de forma descendente"
			}
		};
	}



	public telephoneMask (rawValue: string): Array<string | RegExp> {
		rawValue = rawValue.replace(/[()_-\s]/g, "");
		if (rawValue.length <= 10)
			return ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

		return ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
	}

  public CnpjMask(event) {
    let value = event.target.value;
    // Remove tudo o que não for dígito
    value = value.replace(/\D/g, '');

    // Limita a 14 dígitos para o CNPJ
    value = value.substring(0, 14);

    // Aplica a máscara do CNPJ: 00.000.000/0000-00
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    event.target.value = value;
}

	public cpfMask (rawValue: string): Array<string | RegExp> {
		return [
			/\d/, /\d/, /\d/,
			".", /\d/, /\d/, /\d/,
			".", /\d/, /\d/, /\d/,
			"-", /\d/, /\d/
		];
	}

	public rgMask (rawValue: string): Array<string | RegExp> {
		rawValue = rawValue.replace(/\D/g, "");
		if (rawValue.length <= 8) {
			return [
				/\d/, /\d/, ".",
				/\d/, /\d/, /\d/, ".",
				/\d/, /\d/, /\d/
			];
		}

		return [
			/\d/, /\d/, ".",
			/\d/, /\d/, /\d/, ".",
			/\d/, /\d/, /\d/, "-",
			/\d/
		];
	}

	public cnpjMask (rawValue: string): Array<string | RegExp> {
		return [
			/\d/,
			/\d/,
			".",
			/\d/,
			/\d/,
			/\d/,
			".",
			/\d/,
			/\d/,
			/\d/,
			"/",
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			"-",
			/\d/,
			/\d/,
		];
	}

	public cepMask (rawValue: string): Array<string | RegExp> {
		return [
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			'-',
			/\d/,
			/\d/,
			/\d/
		];
	}



	public getTimeFieldValidator (that: object, params: ITimeFieldValidator = { }) {
		return function validator (control: AbstractControl): { [error: string]: boolean } | null {
			if (control.parent && params.triggerControl)
				control.parent.get(params.triggerControl).updateValueAndValidity();

			const d = moment(control.value);
			if (params.canBeEmpty && (!control.value || d.format("HH:mm") == "00:00"))
				return null;

			if (d.format("HH:mm") == "00:00" || !control.value)
				return { required: true };

			if (control.parent) {
				if (params.smallerControl) {
					const s = moment(control.parent.get(params.smallerControl).value);
					if (d <= s)
						return { tooSmall: true };
				}

				if (params.biggerControl) {
					const b = moment(control.parent.get(params.biggerControl).value);
					if (d > b)
						return { tooBig: true };
				}

				if (params.smallerThenDiference && params.smallerThenDiference.length === 2) {
					const start = moment(control.parent.get(params.smallerThenDiference[0]).value);
					const end = moment(control.parent.get(params.smallerThenDiference[1]).value);

					const diff = moment("00:00:00", "HH:mm:ss");
					diff.add(Math.abs(end.diff(start)));
					if (diff <= d)
						return { tooBig: true };
				}
			}

			return null;
		}.bind(that);
	}




	public getDropdownSettings (idField: string, textField: string = "nome"): IDropdownSettings {
		return {
			singleSelection: false,
			idField,
			textField,
			selectAllText: "Selecionar Tudo",
			unSelectAllText: "Desmarcar Tudo",
			itemsShowLimit: 1,
			allowSearchFilter: true,
			searchPlaceholderText: "Pesquisar"
		};
	}

	public createDateSortingType (): void {
		const jFn: any = jQuery.fn;
		jQuery.extend(jFn.dataTableExt.oSort, {
			"date-br-pre" (a: string): number {
				if (a == null || a == "")
					return 0;

				if (a == "Atual" || a == "Atualidade")
					return parseInt(moment().format("YYYYMMDD"));

				const brDateA: string[] = a.split("/");
				return parseInt(brDateA[2] + brDateA[1] + brDateA[0]);
			},

			"date-br-asc" (a: number, b: number) {
				return (a < b) ? -1 : ((a > b) ? 1 : 0);
			},

			"date-br-desc" (a: number, b: number) {
				return (a < b) ? 1 : ((a > b) ? -1 : 0);
			}
		});
	}

	public createHourSortingType (): void {
		const jFn: any = jQuery.fn;
		jQuery.extend(jFn.dataTableExt.oSort, {
			"hour-pre" (a: string): number {
				if (a == null || a == "")
					return 0;

				const brHourA: string[] = a.split(":");
				let minutes = (Math.abs(parseInt(brHourA[0])) * 60) + parseInt(brHourA[1]);
				if (a[0] === "-")
					minutes *= -1;

				return minutes;
			},

			"hour-asc" (a: number, b: number) {
				return (a < b) ? -1 : ((a > b) ? 1 : 0);
			},

			"hour-desc" (a: number, b: number) {
				return (a < b) ? 1 : ((a > b) ? -1 : 0);
			}
		});
	}

	public getMonthName (index: number): string {
		return ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][index];
	}


	public minToDuration (min: number) {
		return {
			hh: Math.floor(Math.abs(min) / 60) * (min < 0 ? -1 : 1),
			mm: Math.floor(Math.abs(min) % 60) * (min < 0 ? -1 : 1)
		};
	}

	public ngSelectTitle (formControl: AbstractControl, options: object[], valueField: string, labelField: string, placeholder: string): string {
		const value = formControl.value;
		const selected = options.find(opt => opt[valueField] == value);
		return (selected && selected[labelField]) || placeholder;
	}

	public getPeriods (): Array<{ id: number, nome: string }> {
		let date: moment.Moment;
		const periods: Array<{ id: number, nome: string }> = [];

		for (let i = 0; i < 12; i++) {
			date = moment().subtract(i, "months");
			periods.push({ id: i, nome: date.format("YYYY - ") + this.getMonthName(date.month()) });
		}

		periods.push({ id: 12, nome: "Últimos 12 meses" });
		return periods;
	}

}

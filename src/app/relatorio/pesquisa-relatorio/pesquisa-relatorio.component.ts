import { Component, EventEmitter, Output } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as Constants from '.././../constants';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UtilsService } from '../../services//utils/utils.service';

@Component({
  selector: 'app-pesquisa-relatorio',
  templateUrl: './pesquisa-relatorio.component.html',
  styleUrls: ['./pesquisa-relatorio.component.scss']
})
export class PesquisaRelatorioComponent {
  @Output() pesquisar = new EventEmitter<any>();

  statusList = Constants.pedidos;
  rangeDatas: Date[];
  pesquisa = {
    rangeDatas: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
    nomeCompleto: '',
    status: null,
  }

  dropdownSettingsStatus: IDropdownSettings

  bsConfig = {
    isAnimated: true,
    adaptivePosition: true,
    dateInputFormat: 'DD/MM/YYYY',
    rangeInputFormat: 'DD/MM/YYYY',
    maxDate: new Date(),
    locale: 'pt-br'
  };

  months = this.generateMonths();

  constructor(
    private localeService: BsLocaleService,
    private utils: UtilsService
  ) {
    this.localeService.use('pt-br');
		this.dropdownSettingsStatus = this.utils.getDropdownSettings("id_status");

  }

  generateMonths() {
    const now = new Date();
    const months = [];
    for (let i = 0; i <= now.getMonth(); i++) {
      const date = new Date(now.getFullYear(), i, 1);
      months.push({
        value: i,
        label: date.toLocaleString('pt-BR', { month: 'long' })
      });
    }
    return months;
  }



  onMonthChange(event: any) {
    const selectedMonth = event.value;
    if (selectedMonth === 'all') {
      this.pesquisa.rangeDatas = [new Date(new Date().getFullYear(), 0, 1), new Date()];
    } else {
      const month = parseInt(selectedMonth, 10);
      const start = new Date(new Date().getFullYear(), month, 1);
      const end = new Date(new Date().getFullYear(), month + 1, 0);
      this.pesquisa.rangeDatas = [start, end];
    }
  }

  onStatusChange(selectedStatus: string) {
    this.pesquisa.status = selectedStatus === 'null' ? null : selectedStatus;
  }

  iniciarPesquisa() {
    // converter as datas para br string
    // const formattedDateRange = this.pesquisa.rangeDatas.map(date => date.toLocaleDateString('pt-BR'));
    this.pesquisar.emit({...this.pesquisa});
  }
}

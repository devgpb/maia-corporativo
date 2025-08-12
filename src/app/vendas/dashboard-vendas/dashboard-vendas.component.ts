// dashboard-vendas.component.ts
import { Component, OnInit, signal } from '@angular/core';

import { VendasService } from 'src/app/services/vendas/vendas.service';
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';
import { LucideAngularModule, Users, UserPlus, Phone, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-angular';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexPlotOptions, ApexDataLabels, ApexStroke, ApexTooltip, ApexFill,
  ApexNonAxisChartSeries, ApexLegend, ApexResponsive
} from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';




type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
};

type ChartOptionsDonut = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};

type ModalKind = 'novos'|'atendidos'|'fechados'|'eventos'|null;

@Component({
    selector: 'app-dashboard-vendas',
    templateUrl: './dashboard-vendas.component.html',
    styleUrls: ['./dashboard-vendas.component.css'],
    standalone: false
})
export class DashboardVendas implements OnInit {
  data = signal<IDashboardVendas | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedPeriod = signal<'hoje'|'semana'|'mes'>('hoje');
  activeTab = signal<'recentes'|'sem-contato'|'status'|'campanhas'>('recentes');
  statusChart = signal<ChartOptionsBar | null>(null);
  campanhaChart = signal<ChartOptionsDonut | null>(null);

  modalKind = signal<ModalKind>(null);
  modalLoading = signal<boolean>(false);
  modalError = signal<string|null>(null);
  modalItems = signal<(any)[]>([]);
  modalMeta = signal<any>(null);
  modalPage = signal<number>(1);
  readonly modalPerPage = 12;


  // ícones usados pelo lucide-angular
  icons = { Users, UserPlus, Phone, TrendingUp, Clock, CheckCircle, AlertCircle };

  constructor(
    private api: VendasService,
    private modalService: ModalService,
  ) {}

  toggleModal() {
    this.modalService.toggle();
  }

  ngOnInit(): void {
    this.fetch();
  }

  openModal(kind: Exclude<ModalKind, null>) {
    this.modalKind.set(kind);
    this.modalPage.set(1);
    this.toggleModal();
    this.fetchModal();
  }

  closeModal() {
    this.fetchModal();
  }

  nextPage() {
    const meta = this.modalMeta();
    if (!meta) return;
    if (meta.page < meta.totalPages) {
      this.modalPage.set(meta.page + 1);
      this.fetchModal();
    }
  }
  prevPage() {
    const meta = this.modalMeta();
    if (!meta) return;
    if (meta.page > 1) {
      this.modalPage.set(meta.page - 1);
      this.fetchModal();
    }
  }

  private fetchModal() {
    const kind = this.modalKind();
    if (!kind) return;

    this.modalLoading.set(true);
    this.modalError.set(null);

    const periodo = this.selectedPeriod();
    const page = this.modalPage();
    const perPage = this.modalPerPage;

    let req$: Observable<any>;

    switch (kind) {
      case 'novos':
        req$ = this.api.getClientesNovosList(periodo, page, perPage);
        break;
      case 'atendidos':
        req$ = this.api.getClientesAtendidosList(periodo, page, perPage);
        break;
      case 'fechados':
        req$ = this.api.getClientesFechadosList(periodo, page, perPage);
        break;
      case 'eventos':
        req$ = this.api.getEventosMarcadosList(periodo, page, perPage);
        break;
    }

    req$.subscribe({
      next: (res: any) => {
        this.modalItems.set(res.data ?? []);
        this.modalMeta.set(res.meta ?? null);
        this.modalLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.modalError.set('Erro ao carregar a lista');
        this.modalLoading.set(false);
      }
    });
  }

  setPeriod(p: 'hoje'|'semana'|'mes') {
    if (this.selectedPeriod() !== p) {
      this.selectedPeriod.set(p);
      this.fetch();
    }
  }

  setTab(t: 'recentes'|'sem-contato'|'status'|'campanhas') {
    this.activeTab.set(t);
  }

  private fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAtendimento(this.selectedPeriod()).subscribe({
      next: (res) => {
        this.data.set(res);
        this.buildStatusChart(res);
        this.buildCampanhaChart(res);
        this.loading.set(false);
      },
      error: (err) => { console.error(err); this.error.set('Erro ao carregar dados do dashboard'); this.loading.set(false); }
    });
}

  private buildStatusChart(d: IDashboardVendas) {
      const ordered = [...(d.statusDistribution || [])].sort((a,b)=> b.count - a.count);
      const labels = ordered.map(s => s.status || 'Sem status');
      const values = ordered.map(s => s.count);

      this.statusChart.set({
        series: [{ name: 'Clientes', data: values }],
        chart: { type: 'bar', height: 360, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '16px',      // maior
            fontWeight: 'bold',
            colors: ['#fff']       // cor da fonte (sobre a barra)
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            color: '#000',         // cor do contorno
            opacity: 0.7
          }
        },
        stroke: { show: false },
        xaxis: { categories: labels, labels: { rotate: 0 } },
        tooltip: { y: { formatter: (val: number) => `${val} clientes` } },
        fill: { opacity: 1 }
      });
    }

    private buildCampanhaChart(d: IDashboardVendas) {
    const map = new Map<string, number>();

    for (const it of (d.campanhaDistribution ?? [])) {
      const rotuloRaw = (it.campanha ?? 'Sem campanha').trim();
      const rotulo = rotuloRaw.length ? rotuloRaw : 'Sem campanha';
      const key = rotulo.toLowerCase();                    // normaliza
      const val = Number(it.count ?? 0);                   // garante número
      map.set(key, (map.get(key) ?? 0) + (isFinite(val) ? val : 0));
    }

    // se nada vier da API, evita donut vazio
    if (map.size === 0) {
      map.set('sem campanha', 0);
    }

    // ordena desc
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    // label bonito (title-case simples)
    const labels = entries.map(([k]) =>
      k === 'sem campanha'
        ? 'Sem campanha'
        : k.replace(/\b\w/g, c => c.toUpperCase())
    );

    const values = entries.map(([, v]) => v);

    // segurança extra: garante comprimento alinhado e pelo menos 1 valor
    const series = labels.map((_, i) => Number(values[i] ?? 0));

    this.campanhaChart.set({
      series,
      chart: { type: 'donut', height: 360, toolbar: { show: false } },
      labels,
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          colors: ['#fff']
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          color: '#000',
          opacity: 0.7
        }
      },
      tooltip: { y: { formatter: (val: number) => `${val} clientes` } },
      responsive: [{ breakpoint: 1024, options: { legend: { position: 'bottom' } } }]
    });
  }

  formatDate(d?: string | null) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR');
  }

  // helpers de UI
  modalTitle() {
    const k = this.modalKind();
    return k === 'novos' ? 'Clientes novos'
      : k === 'atendidos' ? 'Clientes atendidos'
      : k === 'fechados' ? 'Clientes fechados'
      : k === 'eventos' ? 'Eventos marcados'
      : '';
  }
  isClientList() { return this.modalKind() === 'novos' || this.modalKind() === 'atendidos' || this.modalKind() === 'fechados'; }

  statusPillClass(status?: string|null) {
    const s = (status ?? '').toLowerCase();
    if (['fechado','vendido'].includes(s)) return 'bg-green-100 text-green-700';
    if (['aguardando','pendente','novo'].includes(s)) return 'bg-orange-100 text-orange-700';
    if (['em negociação','negociando','atendido'].includes(s)) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  }
  short(t?: string|null, max=140) {
    if (!t) return '';
    return t.length > max ? t.slice(0, max - 1) + '…' : t;
  }
}

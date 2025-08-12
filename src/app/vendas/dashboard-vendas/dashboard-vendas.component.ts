// dashboard-vendas.component.ts
import { Component, OnInit, signal } from '@angular/core';

import { VendasService } from 'src/app/services/vendas/vendas.service';
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';
import { LucideAngularModule, Users, UserPlus, Phone, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-angular';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexPlotOptions, ApexDataLabels, ApexStroke, ApexTooltip, ApexFill,
  ApexNonAxisChartSeries, ApexLegend, ApexResponsive
} from 'ng-apexcharts';



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
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};

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

  // ícones usados pelo lucide-angular
  icons = { Users, UserPlus, Phone, TrendingUp, Clock, CheckCircle, AlertCircle };

  constructor(private api: VendasService) {}

  ngOnInit(): void {
    this.fetch();
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
        dataLabels: { enabled: true },
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
      tooltip: { y: { formatter: (val: number) => `${val} clientes` } },
      responsive: [{ breakpoint: 1024, options: { legend: { position: 'bottom' } } }]
    });
  }

  formatDate(d?: string | null) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR');
  }
}

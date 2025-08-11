// dashboard-vendas.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendasService } from 'src/app/services/vendas/vendas.service';
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';
import { LucideAngularModule, Users, UserPlus, Phone, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-angular';



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
      next: (res) => { this.data.set(res); this.loading.set(false); },
      error: (err) => { console.error(err); this.error.set('Erro ao carregar dados do dashboard'); this.loading.set(false); }
    });
  }

  formatDate(d?: string | null) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('pt-BR');
  }
}

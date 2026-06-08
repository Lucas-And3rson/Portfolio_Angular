import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, HostBinding, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Chart, ChartConfiguration, ChartType,
  registerables
} from 'chart.js';

import { SimulacaoService } from './services/simulacao.service';
import { ExportService }    from './services/export.service';
import { ThemeService }     from './services/theme.service';
import { BrlPipe }          from './pipes/brl.pipe';
import {
  FormState, Parcela, Resultado, Tema, TotaisTabela
} from './models/simulacao.model';

Chart.register(...registerables);

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule, BrlPipe],
  templateUrl: './simulador.component.html',
  styleUrls:  ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── DI ───────────────────────────────────────────────────────────────────
  private readonly svc    = inject(SimulacaoService);
  private readonly expSvc = inject(ExportService);
  readonly themeSvc       = inject(ThemeService);

  // ── ViewChild (canvas sempre no DOM — sem *ngIf nos gráficos) ───────────
  @ViewChild('lineCanvas') lineRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaCanvas') areaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')  barRef!:  ElementRef<HTMLCanvasElement>;

  // Aplica classe de tema no host do componente
  @HostBinding('class') get hostClass(): string { return this.themeSvc.temaAtual(); }

  // ── Estado ───────────────────────────────────────────────────────────────
  form: FormState = {
    cliente: '', bemFinanciado: '',
    capitalFinanciado: 400_000, valorEntrada: 100_000,
    capitalDisplay: 'R$ 400.000,00', entradaDisplay: 'R$ 100.000,00',
    taxaJurosMensal: 1.20, prazoMeses: 60,
    iof: 0.38, taxaSeguroMensal: 0.10, outrasTaxasMensais: 0.05
  };

  resultado?:   Resultado;
  abaAtiva:    'sac' | 'price' = 'sac';
  filtroSAC   = '';
  filtroPrice = '';
  sacFiltrado:   Parcela[] = [];
  priceFiltrado: Parcela[] = [];

  private charts: Partial<Record<'line'|'area'|'bar', Chart>> = {};
  private chartsInit = false;

  // ── Getters ───────────────────────────────────────────────────────────────
  get totaisSAC():   TotaisTabela | null {
    return this.resultado ? this.svc.totaisTabela(this.sacFiltrado) : null;
  }
  get totaisPRICE(): TotaisTabela | null {
    return this.resultado ? this.svc.totaisTabela(this.priceFiltrado) : null;
  }
  get reducaoSAC(): number {
    const s = this.resultado?.schedulesSAC;
    if (!s?.length) return 0;
    return (1 - s[s.length - 1].prestacaoTotal / s[0].prestacaoTotal) * 100;
  }
  get primeiraParcelaSAC(): number {
    return this.resultado?.schedulesSAC[0]?.prestacaoTotal ?? 0;
  }
  get ultimaParcelaSAC(): number {
    const s = this.resultado?.schedulesSAC;
    return s ? s[s.length - 1]?.prestacaoTotal : 0;
  }
  get primeiraParcelaPRICE(): number {
    return this.resultado?.schedulesPRICE[0]?.prestacaoTotal ?? 0;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void { this.calcular(); }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      this.chartsInit = true;
      this.atualizarGraficos();
    });
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(c => c?.destroy());
  }

  // ── Inputs ────────────────────────────────────────────────────────────────
  onCurrencyInput(e: Event, campo: 'capitalFinanciado' | 'valorEntrada'): void {
    const input   = e.target as HTMLInputElement;
    const raw     = input.value.replace(/\D/g, '');
    const n       = raw ? parseInt(raw, 10) / 100 : 0;
    const fmt     = n > 0 ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

    this.form[campo] = n;
    if (campo === 'capitalFinanciado') this.form.capitalDisplay = fmt;
    else                               this.form.entradaDisplay  = fmt;

    input.value = fmt;
    this.recalcular();
  }

  recalcular(): void {
    this.calcular();
    if (this.chartsInit) this.atualizarGraficos();
  }

  trocarTema(tema: Tema): void { this.themeSvc.aplicar(tema); }

  filtrarTabela(tipo: 'sac' | 'price', termo: string): void {
    if (!this.resultado) return;
    const src = tipo === 'sac'
      ? this.resultado.schedulesSAC
      : this.resultado.schedulesPRICE;
    const lista = termo
      ? src.filter(r => r.periodo.toString().includes(termo))
      : [...src];
    tipo === 'sac' ? (this.sacFiltrado = lista) : (this.priceFiltrado = lista);
  }

  imprimir(): void { window.print(); }

  exportarPDF(): void {
    if (this.resultado) this.expSvc.gerarPDF(this.resultado, this.form);
  }

  exportarExcel(): void {
    if (this.resultado) this.expSvc.gerarExcel(this.resultado, this.form);
  }

  trackPeriodo(_: number, item: Parcela): number { return item.periodo; }

  // ── Cálculo ───────────────────────────────────────────────────────────────
  private calcular(): void {
    const { capitalFinanciado: C, taxaJurosMensal, prazoMeses } = this.form;
    if (!C || !taxaJurosMensal || !prazoMeses) return;

    this.resultado = this.svc.calcularResultado(
      {
        capitalFinanciado:   C,
        taxaJurosMensal:     taxaJurosMensal   / 100,
        prazoMeses,
        iof:                 this.form.iof               / 100,
        taxaSeguroMensal:    this.form.taxaSeguroMensal  / 100,
        outrasTaxasMensais:  this.form.outrasTaxasMensais/ 100,
      },
      this.form.iof / 100
    );

    this.sacFiltrado   = [...this.resultado.schedulesSAC];
    this.priceFiltrado = [...this.resultado.schedulesPRICE];
  }

  // ── Gráficos ──────────────────────────────────────────────────────────────
  private initCharts(): void {
    // ── 1. Linha comparativa SAC vs PRICE ──────────────────────────────────
    this.charts.line = this.criarChart<'line'>(
        this.lineRef.nativeElement, 'line',
        {
        // datasets DEVE estar dentro de data: { ... }
        data: {
            labels: [],
            datasets: [
            {
                label: 'SAC', data: [],
                borderColor: '#003F8A', backgroundColor: 'rgba(0,63,138,.12)',
                fill: true, tension: 0.4, borderWidth: 2.5,
                pointRadius: 0, pointHoverRadius: 5
            },
            {
                label: 'PRICE', data: [],
                borderColor: '#B08000', backgroundColor: 'rgba(176,128,0,.12)',
                fill: true, tension: 0.1, borderWidth: 2.5,
                pointRadius: 0, pointHoverRadius: 5,
                borderDash: [5, 3]
            }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
            legend: {
                position: 'top',
                labels: { usePointStyle: true, padding: 16, font: { size: 11 } }
            },
            tooltip: {
                callbacks: {
                label: ctx => ` ${ctx.dataset.label}: ${this.fmtBRL(ctx.raw as number)}`
                }
            }
            },
            scales: {
            x: {
                title: { display: true, text: 'Período (meses)', font: { size: 11 } },
                grid: { color: 'rgba(0,0,0,.04)' },
                ticks: { autoSkip: true, maxTicksLimit: 20 }
            },
            y: {
                ticks: { callback: v => this.fmtBRL(v as number) },
                grid: { color: 'rgba(0,0,0,.04)' }
            }
            }
        }
        }
    );


    // ── 2. Área empilhada — composição SAC ─────────────────────────────────
    this.charts.area = this.criarChart<'line'>(
        this.areaRef.nativeElement, 'line',
        {
        data: {
            labels: [],
            datasets: [
            {
                label: 'Amortização', data: [],
                borderColor: '#003F8A', backgroundColor: 'rgba(0,63,138,.65)',
                fill: 'origin', tension: 0, pointRadius: 0, borderWidth: 1
            },
            {
                label: 'Juros', data: [],
                borderColor: '#C62828', backgroundColor: 'rgba(198,40,40,.55)',
                fill: '-1', tension: 0, pointRadius: 0, borderWidth: 1
            },
            {
                label: 'Encargos', data: [],
                borderColor: '#B08000', backgroundColor: 'rgba(212,168,0,.55)',
                fill: '-1', tension: 0, pointRadius: 0, borderWidth: 1
            }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true, padding: 10, font: { size: 10 } }
            },
            tooltip: {
                callbacks: {
                label: ctx => {
                    const idx = ctx.datasetIndex;
                    let v = ctx.raw as number;
                    if (idx > 0)
                    v -= ctx.chart.data.datasets[idx - 1].data[ctx.dataIndex] as number;
                    return ` ${ctx.dataset.label}: ${this.fmtBRL(v)}`;
                }
                }
            }
            },
            scales: {
            x: {
                grid: { color: 'rgba(0,0,0,.04)' },
                ticks: { autoSkip: true, maxTicksLimit: 15 }
            },
            y: {
                ticks: {
                callback: v => 'R$ ' + ((v as number) / 1e3).toFixed(0) + 'k',
                font: { size: 10 }
                },
                grid: { color: 'rgba(0,0,0,.04)' }
            }
            }
        }
        }
    );

    // ── 3. Colunas — comparativo de montante total ──────────────────────────
    this.charts.bar = this.criarChart<'bar'>(
        this.barRef.nativeElement, 'bar',
        {
        data: {
            labels: ['Total Pago', 'Total Juros', 'Total Encargos'],
            datasets: [
            {
                label: 'SAC',   data: [0, 0, 0],
                backgroundColor: '#003F8A', borderRadius: 6, borderSkipped: false
            },
            {
                label: 'PRICE', data: [0, 0, 0],
                backgroundColor: '#B08000', borderRadius: 6, borderSkipped: false
            }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true, padding: 10, font: { size: 10 } }
            },
            tooltip: {
                callbacks: {
                label: ctx => ` ${ctx.dataset.label}: ${this.fmtBRL(ctx.raw as number)}`
                }
            }
            },
            scales: {
            y: {
                ticks: {
                callback: v => 'R$ ' + ((v as number) / 1e3).toFixed(0) + 'k',
                font: { size: 10 }
                },
                grid: { color: 'rgba(0,0,0,.04)' }
            },
            x: { grid: { display: false } }
            }
        }
        }
    );
  }

  private criarChart<T extends ChartType>(
    canvas: HTMLCanvasElement,
    type: T,
    cfg: Omit<ChartConfiguration<T>, 'type'>
  ): Chart<T> {
    return new Chart<T>(canvas, { type, ...cfg } as ChartConfiguration<T>);
  }

  private atualizarGraficos(): void {
    if (!this.resultado) return;
    const sac   = this.resultado.schedulesSAC;
    const price = this.resultado.schedulesPRICE;

    // Amostragem para prazos longos
    const step   = sac.length > 120 ? Math.ceil(sac.length / 60) : 1;
    const lSac   = sac.filter((_,i)   => i % step === 0 || i === sac.length - 1);
    const lPrice = price.filter((_,i) => i % step === 0 || i === price.length - 1);
    const labels = lSac.map(r => String(r.periodo));

    const lc = this.charts.line;
    if (lc) {
      lc.data.labels          = labels;
      lc.data.datasets[0].data = lSac.map(r => r.prestacaoTotal);
      lc.data.datasets[1].data = lPrice.map(r => r.prestacaoTotal);
      lc.update('active');
    }

    const ac = this.charts.area;
    if (ac) {
      ac.data.labels          = labels;
      // Dados acumulados para stacking visual correto
      ac.data.datasets[0].data = lSac.map(r => r.amortizacao);
      ac.data.datasets[1].data = lSac.map(r => r.amortizacao + r.juros);
      ac.data.datasets[2].data = lSac.map(r => r.amortizacao + r.juros + r.seguro + r.outrasTaxas);
      ac.update('active');
    }

    const bc = this.charts.bar;
    if (bc && this.resultado) {
      const r    = this.resultado;
      const encS = sac.reduce(  (a,v) => a + v.seguro + v.outrasTaxas, 0);
      const encP = price.reduce((a,v) => a + v.seguro + v.outrasTaxas, 0);
      bc.data.datasets[0].data = [r.totalSAC,   r.jurosTotalSAC,   encS];
      bc.data.datasets[1].data = [r.totalPRICE, r.jurosTotalPRICE, encP];
      bc.update('active');
    }
  }

  private fmtBRL(v: number): string {
    const abs        = Math.abs(v).toFixed(2);
    const [int, dec] = abs.split('.');
    return (v < 0 ? '-R$ ' : 'R$ ') + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
  }
}
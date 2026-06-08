import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FormState, Parcela, Resultado, TotaisTabela } from '../models/simulacao.model';

@Injectable({ providedIn: 'root' })
export class ExportService {

  // ── PDF ──────────────────────────────────────────────────────────────────

  gerarPDF(resultado: Resultado, form: FormState): void {
    const doc  = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W    = doc.internal.pageSize.getWidth();
    const H    = doc.internal.pageSize.getHeight();
    const hoje = new Date().toLocaleDateString('pt-BR');

    const cabecalho = (titulo: string) => {
      // Fundo azul
      doc.setFillColor(0, 45, 99);
      doc.rect(0, 0, W, 22, 'F');
      // Barra amarela
      doc.setFillColor(246, 193, 0);
      doc.rect(0, 22, W, 2.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('BB Simulador — SAC vs PRICE', 12, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(titulo, 12, 19);

      if (form.cliente)      doc.text(`Cliente: ${form.cliente}`,           W - 12, 10, { align: 'right' });
      if (form.bemFinanciado) doc.text(`Bem: ${form.bemFinanciado}`,       W - 12, 16, { align: 'right' });
      doc.setTextColor(51, 51, 51);
    };

    const rodape = () => {
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Gerado em ${hoje} • Uso interno • Cálculos estimativos sujeitos à confirmação`,
        W / 2, H - 4, { align: 'center' }
      );
    };

    // ── Pág. 1 — Resumo Comparativo ───────────────────────────────────────
    cabecalho('Resumo Comparativo da Operação');

    autoTable(doc, {
      startY: 30,
      head: [['Indicador', 'SAC', 'PRICE (Tabela Price)', 'Diferença']],
      body: [
        ['Capital Financiado', this.f(form.capitalFinanciado), this.f(form.capitalFinanciado), '—'],
        ['Valor de Entrada',    this.f(form.valorEntrada),     this.f(form.valorEntrada),     '—'],
        ['Taxa de Juros Mensal',`${form.taxaJurosMensal}% a.m.`, `${form.taxaJurosMensal}% a.m.`, '—'],
        ['Prazo',              `${form.prazoMeses} meses`,    `${form.prazoMeses} meses`,    '—'],
        ['IOF Total',           this.f(resultado.iofTotal),   this.f(resultado.iofTotal),    '—'],
        ['Total em Juros',      this.f(resultado.jurosTotalSAC), this.f(resultado.jurosTotalPRICE),
          this.f(Math.abs(resultado.jurosTotalPRICE - resultado.jurosTotalSAC))],
        ['Total em Seguros',    this.f(resultado.seguroTotalSAC), this.f(resultado.seguroTotalPRICE),
          this.f(Math.abs(resultado.seguroTotalPRICE - resultado.seguroTotalSAC))],
        ['MONTANTE TOTAL',      this.f(resultado.totalSAC),   this.f(resultado.totalPRICE),
          this.f(Math.abs(resultado.economia))],
        ['Sistema Mais Econômico', resultado.melhorSistema,  '—',
          `${resultado.percentualDiferenca.toFixed(2)}% de economia`],
      ],
      styles:              { fontSize: 8.5, cellPadding: 2.5 },
      headStyles:          { fillColor: [0, 63, 138], textColor: [255,255,255], fontStyle: 'bold' },
      alternateRowStyles:  { fillColor: [248, 249, 250] },
      columnStyles:        { 0: { fontStyle: 'bold', cellWidth: 60 } },
      margin:              { left: 12, right: 12 },
    });

    rodape();

    // ── Pág. 2 — Tabela SAC ───────────────────────────────────────────────
    doc.addPage();
    cabecalho('Tabela de Amortização — Sistema SAC');

    const totSAC = this.somarTabela(resultado.schedulesSAC);
    autoTable(doc, {
      startY: 30,
      head:   [this.cabTabel()],
      body:   resultado.schedulesSAC.map(r => this.linhaTabela(r)),
      foot:   [this.rodapeTabel(totSAC)],
      styles:             { fontSize: 7.5, cellPadding: 1.8, halign: 'right' },
      headStyles:         { fillColor: [0, 63, 138], textColor: [255,255,255], halign: 'right' },
      footStyles:         { fillColor: [0, 45, 99],  textColor: [255,255,255], fontStyle: 'bold', halign: 'right' },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles:       { 0: { halign: 'center', fontStyle: 'bold', textColor: [0,63,138] } },
      margin:             { left: 12, right: 12 },
    });

    rodape();

    // ── Pág. 3 — Tabela PRICE ─────────────────────────────────────────────
    doc.addPage();
    cabecalho('Tabela de Amortização — Sistema PRICE (Tabela Price)');

    const totPRICE = this.somarTabela(resultado.schedulesPRICE);
    autoTable(doc, {
      startY: 30,
      head:   [this.cabTabel()],
      body:   resultado.schedulesPRICE.map(r => this.linhaTabela(r)),
      foot:   [this.rodapeTabel(totPRICE)],
      styles:             { fontSize: 7.5, cellPadding: 1.8, halign: 'right' },
      headStyles:         { fillColor: [180, 130, 0], textColor: [255,255,255], halign: 'right' },
      footStyles:         { fillColor: [100, 70, 0],  textColor: [255,255,255], fontStyle: 'bold', halign: 'right' },
      alternateRowStyles: { fillColor: [254, 251, 240] },
      columnStyles:       { 0: { halign: 'center', fontStyle: 'bold', textColor: [140,100,0] } },
      margin:             { left: 12, right: 12 },
    });

    rodape();

    const nomeArq = `SAC_PRICE_${(form.cliente || 'simulacao').replace(/\s+/g, '_')}_${hoje.replace(/\//g,'-')}.pdf`;
    doc.save(nomeArq);
  }

  // ── EXCEL ─────────────────────────────────────────────────────────────────

  gerarExcel(resultado: Resultado, form: FormState): void {
    const wb = XLSX.utils.book_new();

    // Aba Resumo
    const resumo = [
      ['SIMULADOR SAC vs PRICE', '', '', ''],
      [''],
      ['Indicador', 'SAC', 'PRICE', 'Diferença'],
      ['Cliente',          form.cliente,         form.cliente,         ''],
      ['Bem Financiado',   form.bemFinanciado,   form.bemFinanciado,   ''],
      ['Capital Financiado', form.capitalFinanciado, form.capitalFinanciado, ''],
      ['Valor de Entrada', form.valorEntrada,    form.valorEntrada,    ''],
      ['Taxa Mensal (%)',   form.taxaJurosMensal, form.taxaJurosMensal, ''],
      ['Prazo (meses)',     form.prazoMeses,      form.prazoMeses,      ''],
      ['IOF Total',        resultado.iofTotal,   resultado.iofTotal,   0],
      ['Total em Juros',   resultado.jurosTotalSAC, resultado.jurosTotalPRICE,
        Math.abs(resultado.jurosTotalPRICE - resultado.jurosTotalSAC)],
      ['Total em Seguros', resultado.seguroTotalSAC, resultado.seguroTotalPRICE,
        Math.abs(resultado.seguroTotalPRICE - resultado.seguroTotalSAC)],
      ['MONTANTE TOTAL',   resultado.totalSAC,   resultado.totalPRICE, Math.abs(resultado.economia)],
      ['Sistema Vantajoso', resultado.melhorSistema, '', `${resultado.percentualDiferenca.toFixed(2)}%`],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
    wsResumo['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    // Aba SAC
    const cabSAC = ['Período','Prestação','Juros','Amortização','Seguro','Outras Taxas','Total c/ Enc.','Saldo Devedor'];
    const dadosSAC = resultado.schedulesSAC.map(r =>
      [r.periodo, r.prestacao, r.juros, r.amortizacao, r.seguro, r.outrasTaxas, r.prestacaoTotal, r.saldoDevedor]
    );
    const wsSAC = XLSX.utils.aoa_to_sheet([cabSAC, ...dadosSAC]);
    wsSAC['!cols'] = cabSAC.map((_, i) => ({ wch: i === 0 ? 8 : 16 }));
    XLSX.utils.book_append_sheet(wb, wsSAC, 'SAC');

    // Aba PRICE
    const dadosPRICE = resultado.schedulesPRICE.map(r =>
      [r.periodo, r.prestacao, r.juros, r.amortizacao, r.seguro, r.outrasTaxas, r.prestacaoTotal, r.saldoDevedor]
    );
    const wsPRICE = XLSX.utils.aoa_to_sheet([cabSAC, ...dadosPRICE]);
    wsPRICE['!cols'] = cabSAC.map((_, i) => ({ wch: i === 0 ? 8 : 16 }));
    XLSX.utils.book_append_sheet(wb, wsPRICE, 'PRICE');

    const nomeArq = `SAC_PRICE_${(form.cliente || 'simulacao').replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, nomeArq);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private f(v: number): string {
    const n   = Math.abs(v).toFixed(2);
    const [i, d] = n.split('.');
    return (v < 0 ? '-R$ ' : 'R$ ') + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + d;
  }

  private cabTabel(): string[] {
    return ['Per.','Prestação','Juros','Amortização','Seguro','Outras Taxas','Total c/ Enc.','Saldo Devedor'];
  }

  private linhaTabela(r: Parcela): (string | number)[] {
    return [r.periodo, this.f(r.prestacao), this.f(r.juros), this.f(r.amortizacao),
            this.f(r.seguro), this.f(r.outrasTaxas), this.f(r.prestacaoTotal), this.f(r.saldoDevedor)];
  }

  private rodapeTabel(t: TotaisTabela): string[] {
    return ['TOTAL', this.f(t.prestacao), this.f(t.juros), this.f(t.amortizacao),
            this.f(t.seguro), this.f(t.outrasTaxas), this.f(t.prestacaoTotal), '—'];
  }

  private somarTabela(rows: Parcela[]): TotaisTabela {
    const s = (f: keyof Parcela) => rows.reduce((a, r) => a + (r[f] as number), 0);
    return { prestacao: s('prestacao'), juros: s('juros'), amortizacao: s('amortizacao'),
             seguro: s('seguro'), outrasTaxas: s('outrasTaxas'), prestacaoTotal: s('prestacaoTotal') };
  }
}
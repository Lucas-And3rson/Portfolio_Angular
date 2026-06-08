import { Injectable } from '@angular/core';
import { Parcela, Resultado, SimulacaoParams, TotaisTabela } from '../models/simulacao.model';

@Injectable({ providedIn: 'root' })
export class SimulacaoService {

  calcularSAC(p: SimulacaoParams): Parcela[] {
    const { capitalFinanciado: C, taxaJurosMensal: i,
            prazoMeses: n, taxaSeguroMensal: s, outrasTaxasMensais: t } = p;
    if (!C || !i || !n) return [];

    const amort = C / n;
    let saldo   = C;

    return Array.from({ length: n }, (_, idx) => {
      const periodo = idx + 1;
      const juros   = saldo * i;
      const prest   = amort + juros;
      const seg     = saldo * s;
      const tx      = saldo * t;
      saldo         = Math.max(0, saldo - amort);
      return {
        periodo, prestacao: prest, juros,
        amortizacao: amort, seguro: seg, outrasTaxas: tx,
        prestacaoTotal: prest + seg + tx, saldoDevedor: saldo
      };
    });
  }

  calcularPRICE(p: SimulacaoParams): Parcela[] {
    const { capitalFinanciado: C, taxaJurosMensal: i,
            prazoMeses: n, taxaSeguroMensal: s, outrasTaxasMensais: t } = p;
    if (!C || !i || !n) return [];

    const fator = Math.pow(1 + i, n);
    const prest = C * (i * fator) / (fator - 1);
    let saldo   = C;

    return Array.from({ length: n }, (_, idx) => {
      const periodo = idx + 1;
      const juros   = saldo * i;
      const amort   = prest - juros;
      const seg     = saldo * s;
      const tx      = saldo * t;
      saldo         = Math.max(0, saldo - amort);
      return {
        periodo, prestacao: prest, juros,
        amortizacao: amort, seguro: seg, outrasTaxas: tx,
        prestacaoTotal: prest + seg + tx, saldoDevedor: saldo
      };
    });
  }

  calcularResultado(p: SimulacaoParams, iofDecimal: number): Resultado {
    const sac      = this.calcularSAC(p);
    const price    = this.calcularPRICE(p);
    const iofTotal = p.capitalFinanciado * iofDecimal;
    const sum      = (arr: Parcela[], f: keyof Parcela) =>
      arr.reduce((a, r) => a + (r[f] as number), 0);

    const totalSAC   = sum(sac,   'prestacaoTotal') + iofTotal;
    const totalPRICE = sum(price, 'prestacaoTotal') + iofTotal;
    const economia   = totalPRICE - totalSAC;  // positivo = SAC ganha

    return {
      schedulesSAC: sac, schedulesPRICE: price,
      totalSAC, totalPRICE,
      jurosTotalSAC:    sum(sac,   'juros'),
      jurosTotalPRICE:  sum(price, 'juros'),
      seguroTotalSAC:   sum(sac,   'seguro'),
      seguroTotalPRICE: sum(price, 'seguro'),
      iofTotal, economia,
      percentualDiferenca: totalSAC > 0
        ? Math.abs(economia / totalSAC * 100) : 0,
      melhorSistema: economia > 0 ? 'SAC' : economia < 0 ? 'PRICE' : 'IGUAL'
    };
  }

  totaisTabela(rows: Parcela[]): TotaisTabela {
    const s = (f: keyof Parcela) => rows.reduce((a, r) => a + (r[f] as number), 0);
    return {
      prestacao: s('prestacao'), juros: s('juros'),
      amortizacao: s('amortizacao'), seguro: s('seguro'),
      outrasTaxas: s('outrasTaxas'), prestacaoTotal: s('prestacaoTotal')
    };
  }
}
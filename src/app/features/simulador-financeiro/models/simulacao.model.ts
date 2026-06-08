export interface Parcela {
  periodo:        number;
  prestacao:      number;
  juros:          number;
  amortizacao:    number;
  seguro:         number;
  outrasTaxas:    number;
  prestacaoTotal: number;
  saldoDevedor:   number;
}

/** Usada tanto no componente quanto no ExportService */
export interface FormState {
  cliente:            string;
  bemFinanciado:      string;
  capitalFinanciado:  number;
  valorEntrada:       number;
  capitalDisplay:     string;
  entradaDisplay:     string;
  taxaJurosMensal:    number;   // 1.20 = 1,20%
  prazoMeses:         number;
  iof:                number;   // 0.38 = 0,38%
  taxaSeguroMensal:   number;
  outrasTaxasMensais: number;
}

export interface SimulacaoParams {
  capitalFinanciado:  number;
  taxaJurosMensal:    number;   // decimal: 0.012 = 1,2%
  prazoMeses:         number;
  iof:                number;
  taxaSeguroMensal:   number;
  outrasTaxasMensais: number;
}

export interface TotaisTabela {
  prestacao:      number;
  juros:          number;
  amortizacao:    number;
  seguro:         number;
  outrasTaxas:    number;
  prestacaoTotal: number;
}

export interface Resultado {
  schedulesSAC:     Parcela[];
  schedulesPRICE:   Parcela[];
  totalSAC:         number;
  totalPRICE:       number;
  jurosTotalSAC:    number;
  jurosTotalPRICE:  number;
  seguroTotalSAC:   number;
  seguroTotalPRICE: number;
  iofTotal:         number;
  economia:         number;           // positivo = SAC mais barato
  percentualDiferenca: number;
  melhorSistema:    'SAC' | 'PRICE' | 'IGUAL';
}

export type Tema = 'tema-claro' | 'tema-escuro' | 'alto-contraste';
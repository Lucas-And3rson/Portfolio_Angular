import { Injectable, signal } from '@angular/core';
import { Tema } from '../models/simulacao.model';

const TEMAS: { valor: Tema; rotulo: string; icone: string }[] = [
  { valor: 'tema-claro',      rotulo: 'BB Claro',       icone: '☀️' },
  { valor: 'tema-escuro',     rotulo: 'BB Escuro',      icone: '🌙' },
  { valor: 'alto-contraste',  rotulo: 'Alto Contraste', icone: '◑'  },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly temas    = TEMAS;
  readonly temaAtual = signal<Tema>('tema-claro');

  aplicar(tema: Tema): void {
    this.temaAtual.set(tema);
  }
}
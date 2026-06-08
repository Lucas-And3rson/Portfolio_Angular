import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'brl', standalone: true, pure: true })
export class BrlPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || !isFinite(value)) return 'R$ 0,00';
    const abs        = Math.abs(value).toFixed(2);
    const [int, dec] = abs.split('.');
    const formatted  = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (value < 0 ? '-R$ ' : 'R$ ') + formatted + ',' + dec;
  }
}
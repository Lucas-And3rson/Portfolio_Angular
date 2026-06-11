import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMobileOpen = signal(false);
 
  navLinks = [
    { label: 'Início',       href: '#inicio' },
    { label: 'Sobre',        href: '#sobre' },
    { label: 'Habilidades',  href: '#habilidades' },
    { label: 'Projetos',     href: '#projetos' },
    { label: 'Depoimentos',  href: '#depoimentos' },
    { label: 'Contato',      href: '#contato' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobile() {
    this.isMobileOpen.update(v => !v);
  }

  closeMobile() {
    this.isMobileOpen.set(false);
  }

  scrollTo(href: string) {
    this.closeMobile();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

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

  // Número do WhatsApp (formato internacional sem espaços)
  private whatsappNumber = '5587981766743';
  
  // Mensagem personalizada
  private whatsappMessage = 'Olá Lucas! Sou recrutador(a) e encontrei seu portfólio. Temos uma vaga que pode se encaixar no seu perfil. Podemos conversar sobre essa oportunidade?';
  
  // Link completo do WhatsApp
  get whatsappLink(): string {
    const encodedMessage = encodeURIComponent(this.whatsappMessage);
    return `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
  }
  
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

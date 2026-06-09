import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TechBadge {
  name: string;
  icon: string;
  class: string;
  experience: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  displayText = signal('');
  
  // Gerencia qual stack está selecionada no momento
  selectedBadge = signal<TechBadge | null>(null);

  // Array unificado com dados de visualização e metadados de experiência
  techBadges: TechBadge[] = [
    { name: 'Laravel', icon: 'fab fa-laravel', class: 'badge-laravel', experience: '3 Anos' },
    { name: 'Angular', icon: 'fab fa-angular', class: 'badge-angular', experience: '2 Anos' },
    { name: 'IA', icon: 'fas fa-brain', class: 'badge-ai', experience: '1 Ano' },
    { name: 'PHP', icon: 'fab fa-php', class: 'badge-php', experience: '4 Anos' }
  ];

  private phrases = [
    'Full Stack Developer',
    'Laravel & Angular Expert',
    'Sistemas Hospitalares',
    'APIs REST & IA',
    'Análise de Dados e Automação',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.type();
  }

  ngOnDestroy() {
    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

  // Seleciona um badge e impede o clique de propagar para o fundo
  selectBadge(badge: TechBadge, event: Event) {
    event.stopPropagation();
    this.selectedBadge.set(badge);
  }

  // Fecha o mini card de experiência
  closeBadge(event: Event) {
    event.stopPropagation();
    this.selectedBadge.set(null);
  }

  private type() {
    const current = this.phrases[this.phraseIndex];
    if (this.isDeleting) {
      this.displayText.set(current.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.displayText.set(current.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let speed = this.isDeleting ? 60 : 100;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 400;
    }

    this.typingTimer = setTimeout(() => this.type(), speed);
  }

  scrollToProjects() {
    document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact() {
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
  }
}
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  displayText = signal('');
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

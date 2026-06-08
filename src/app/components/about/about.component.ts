import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  stats = [
    { value: 5,   suffix: '+', label: 'Anos de Experiência' },
    { value: 4,   suffix: '',  label: 'Projetos' },
    { value: 15,  suffix: '+', label: 'Tecnologias Dominadas' },
    { value: 2, suffix: '', label: 'Sistemas em Produção' },
  ];

  animatedStats = this.stats.map(s => ({ ...s, current: 0 }));

  timeline = [
    {
      year: '2020–2023',
      title: 'Técnico em Informática',
      desc: 'Formação técnica integrada no IFPE, com base em redes, programação e desenvolvimento web.',
      icon: 'fas fa-graduation-cap',
      color: 'cyan'
    },
    {
      year: '2024',
      title: 'Sistema de Gestão Z-65',
      desc: 'Desenvolvimento de sistema de cadastro e API de boletos para a Colônia de Pescadores Z-65, em produção.',
      icon: 'fas fa-server',
      color: 'cyan'
    },
    {
      year: '2025',
      title: 'Desenvolvedor Full Stack PJ',
      desc: 'Entrega de sistema hospitalar completo para cliente real, atuando com autonomia total da arquitetura ao deploy.',
      icon: 'fas fa-briefcase',
      color: 'purple'
    },
    {
      year: '2026',
      title: 'Graduação em ADS',
      desc: 'Ingresso na UniCesumar no curso de Análise e Desenvolvimento de Sistemas, aprofundando arquitetura e engenharia de software.',
      icon: 'fas fa-university',
      color: 'blue'
    },
  ];

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    setTimeout(() => {
      const el = document.querySelector('#sobre');
      if (el) observer.observe(el);
    }, 100);
  }

  private animateCounters() {
    this.stats.forEach((stat, i) => {
      const duration = 1800;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        this.animatedStats[i].current = Math.floor(current);
      }, duration / steps);
    });
  }
}

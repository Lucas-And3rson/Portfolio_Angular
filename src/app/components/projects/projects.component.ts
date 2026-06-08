import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  features: string[];
  badge: string;
  badgeColor: string;
  icon: string;
  color: string;
  github?: string;
  liveLink?: string;
  mediaItems?: { type: 'image' | 'video'; src: string; }[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  activeProject = signal<number | null>(null);
  showModal = signal(false);
  selectedProject = signal<Project | null>(null);
  currentSlide = signal(0);

  constructor(private sanitizer: DomSanitizer) {
    console.log('ProjectsComponent initialized');
    console.log('Projects data:', this.projects);
  }

  projects: Project[] = [
    {
      title: 'Sistema de Gestão Hospitalar Web',
      subtitle: 'Contrato PJ — Prefeitura Municipal de Solidão',
      description: 'Plataforma hospitalar completa desenvolvida do zero sob contrato PJ, responsável por toda a arquitetura e entrega. Sistema real em uso por profissionais de saúde.',
      badge: 'Em Produção',
      badgeColor: 'green',
      icon: 'fas fa-hospital',
      color: 'cyan',
      tags: ['Laravel', 'PHP', 'Angular', 'MySQL', 'SSE', 'Chart.js', 'REST API', '2FA', 'Groq AI'],
      mediaItems: [
        { type: 'image', src: 'images/capasProjetos/hospital/image 1.webp' },
        { type: 'image', src: 'images/capasProjetos/hospital/image 2.webp' },
        { type: 'image', src: 'images/capasProjetos/hospital/image 3.webp' },
        { type: 'image', src: 'images/capasProjetos/hospital/image 4.webp' },
        // { type: 'video', src: 'https://www.youtube.com/embed/IDVIDEO?autoplay=1&mute=1&loop=1&controls=0&playlist=IDVIDEO' }, // Substituir com o ID real do vídeo
      ],
      features: [
        'Triagem médica e gestão de pacientes',
        'Controle de internações, leitos e medicações',
        'Dashboard em tempo real via SSE + Chart.js',
        'Agente de IA integrado via API Groq',
        'Autenticação segura com 2FA',
        'Arquitetura MVC com APIs RESTful',
      ],
    },
    {
      title: 'Sistema de Gestão e Cobrança',
      subtitle: 'Colônia de Pescadores e Aquicultores Z-65',
      description: 'Sistema web completo de gestão de associados e geração de boletos para entidade real. API de boletos personalizada e dinâmica, com ambiente hospedado e em produção.',
      badge: 'Em Produção',
      badgeColor: 'green',
      icon: 'fas fa-file-invoice-dollar',
      color: 'blue',
      tags: ['Laravel', 'PHP', 'Node.js', 'JavaScript', 'HTML', 'SCSS', 'REST API', 'Hostinger'],
      github: 'https://github.com/Lucas-And3rson/Colonia-Z-65',
      mediaItems: [
        { type: 'image', src: 'images/capasProjetos/favicon.webp' },
      ],
      features: [
        'Cadastro e gestão de associados',
        'API customizada de geração de boletos',
        'Layout de boleto dinâmico e personalizado',
        'Backend Laravel + Node.js auxiliar',
        'Frontend responsivo com SCSS',
        'Deploy e hospedagem configurados na Hostinger',
      ],
    },
    {
      title: 'Simulador Financeiro - PRICE vs SAC',
      subtitle: 'Autônomo',
      description: 'Simulador Executivo de Financiamentos | Comparação SAC vs PRICE. Este simulador foi desenvolvido para auxiliar profissionais e clientes na análise comparativa de financiamentos imobiliários, pessoais e demais modalidades de crédito.',
      badge: 'Em produção',
      badgeColor: 'green',
      icon: 'fas fa-dollar',
      color: 'green',
      tags: ['React', 'Node.js', 'JavaScript', 'HTML', 'SCSS', 'GitHub', 'Manus AI'],
      github: 'https://github.com/Lucas-And3rson/simulador-financeiro',
      liveLink: 'https://financinav-hblp3nx4.manus.space/',
      mediaItems: [
        { type: 'image', src: 'images/capasProjetos/financeiro/image 3.webp' },
        { type: 'image', src: 'images/capasProjetos/financeiro/image 1.webp' },
        { type: 'image', src: 'images/capasProjetos/financeiro/image 2.webp' },
        { type: 'image', src: 'images/capasProjetos/financeiro/image 4.webp' },
      ],
      features: [
        'Cálculo em tempo real de financiamento',
        'Gráficos dinâmicos e responsivos ',
        'Taxas realistas em % ou fixas',
        'Backend Node.js',
        'Frontend responsivo com React e SCSS',
        'Deploy com GitHub e Manus AI',
      ],
    },
    {
      title: 'Automação de agendamentos',
      subtitle: 'Autônomo',
      description: 'Recepcionista 24/7',
      badge: 'Em construção',
      badgeColor: 'yellow',
      icon: 'fas fa-calendar',
      color: 'purple',
      tags: ['Laravel', 'Angular', 'AI Agent', 'Google Calendar', 'JS', 'HTML', 'SCSS', 'Claude AI', 'Hostinger'],
      mediaItems: [
        { type: 'image', src: 'images/capasProjetos/favicon.webp' },
      ],
      features: [
        'Cálculo em tempo real de financiamento',
        'Gráficos dinâmicos e responsivos ',
        'Taxas realistas em % ou fixas',
        'Backend Node.js',
        'Frontend responsivo com React e SCSS',
        'Deploy com GitHub e Manus AI',
      ],
    },
  ];

  toggleProject(index: number) {
    this.activeProject.update(v => v === index ? null : index);
  }

  openModal(project: Project) {
    this.selectedProject.set(project);
    this.currentSlide.set(0);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedProject.set(null);
  }

  nextSlide() {
    if (this.selectedProject() && this.selectedProject()!.mediaItems) {
      this.currentSlide.update(current => (current + 1) % this.selectedProject()!.mediaItems!.length);
    }
  }

  prevSlide() {
    if (this.selectedProject() && this.selectedProject()!.mediaItems) {
      this.currentSlide.update(current => (current - 1 + this.selectedProject()!.mediaItems!.length) % this.selectedProject()!.mediaItems!.length);
    }
  }

  getSafeMediaSrc(src: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }
}

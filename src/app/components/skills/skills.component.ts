import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  icon: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  categories: SkillCategory[] = [
    {
      title: 'Backend',
      icon: 'fas fa-server',
      color: 'cyan',
      skills: [
        { name: 'PHP',      icon: 'fab fa-php',    level: 85 },
        { name: 'Laravel',  icon: 'fab fa-laravel', level: 85 },
        { name: 'Node.js',  icon: 'fab fa-node-js', level: 65 },
        { name: 'REST APIs',icon: 'fas fa-plug',    level: 82 },
      ]
    },
    {
      title: 'Frontend',
      icon: 'fas fa-desktop',
      color: 'blue',
      skills: [
        { name: 'Angular',     icon: 'fab fa-angular',  level: 80 },
        { name: 'JavaScript',  icon: 'fab fa-js',       level: 80 },
        { name: 'HTML5',       icon: 'fab fa-html5',    level: 90 },
        { name: 'CSS3 / SCSS', icon: 'fab fa-css3-alt', level: 85 },
      ]
    },
    {
      title: 'Banco de Dados',
      icon: 'fas fa-database',
      color: 'purple',
      skills: [
        { name: 'MySQL',      icon: 'fas fa-database', level: 78 },
        { name: 'phpMyAdmin', icon: 'fas fa-table',    level: 80 },
      ]
    },
    {
      title: 'DevOps & Ferramentas',
      icon: 'fas fa-tools',
      color: 'cyan',
      skills: [
        { name: 'Git / GitHub', icon: 'fab fa-git-alt',  level: 80 },
        { name: 'Chart.js',     icon: 'fas fa-chart-bar',level: 75 },
        { name: 'SSE',          icon: 'fas fa-stream',   level: 70 },
        { name: 'Hostinger',    icon: 'fas fa-cloud',    level: 72 },
      ]
    },
    {
      title: 'Arquitetura & Segurança',
      icon: 'fas fa-shield-alt',
      color: 'blue',
      skills: [
        { name: 'Autenticação 2FA', icon: 'fas fa-lock',   level: 80 },
        { name: 'MVC',              icon: 'fas fa-layer-group', level: 82 },
        { name: 'APIs RESTful',     icon: 'fas fa-project-diagram', level: 82 },
        { name: 'Integração IA',    icon: 'fas fa-brain',  level: 70 },
      ]
    },
  ];
}

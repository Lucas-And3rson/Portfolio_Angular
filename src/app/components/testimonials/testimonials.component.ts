import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  current = signal(0);

  testimonials = [
    {
      name: 'Laura Raquel Alves',
      role: 'Gerente de relacionamento PJ',
      company: 'Banco do Brasil',
      avatar: 'LR',
      color: 'purple',
      text: 'Profissional organizado, comprometido e com real expertise na área em que atua, sendo um ótimo desenvolver de software. Foi-me apresentado projeto completo para uma instituição e, por meio deste, fez-se possível ver sua capacidade. Posso inferir que é um alguém que eu indicaria com facilidade para pessoas que conheço.',
      validationLink: 'https://www.linkedin.com/in/devlucasanderson/details/recommendations/?detailScreenTabIndex=0#:~:text=Profissional%20organizado%2C%20comprometido,pessoas%20que%20conhe%C3%A7o.'
    },
    {
      name: 'Renan Santana',
      role: 'Competitive Programmer',
      company: 'Ex colega no IFPE',
      avatar: 'RS',
      color: 'blue',
      text: 'Já tive a oportunidade de estudar e desenvolver trabalhos em grupo com ele, então sou capaz de afirmar que ele possui boa comunicação, consegue trabalhar em equipe, além disso, ele possui a principal habilidade para um desenvolvedor, que é resolver problemas. Dito isso, Lucas é uma pessoa comprometida que sempre busca aprender mais e sempre busca entregar bons resultados. Tenho certeza de que ele pode ser o diferencial em qualquer empresa ou projeto do qual faça parte.',
      validationLink: 'https://www.linkedin.com/in/devlucasanderson/details/recommendations/?detailScreenTabIndex=0#:~:text=Al%C3%A9m%20do%20conhecimento,qual%20fa%C3%A7a%20parte.'
    },
    {
      name: 'Mônica Lima',
      role: 'Diretora do hospital',
      company: 'UMMJS | Solidão',
      avatar: 'ML',
      color: 'cyan',
      text: 'O Lucas foi muito dedicado no desenvolvimento do nosso sistema hospitalar, sempre buscando soluções práticas e eficientes para a equipe. É um profissional responsável, atencioso e muito comprometido com a qualidade do trabalho. Recomendo com confiança.',
      validationLink: ''
    },
  ];

  prev() {
    this.current.update(v => (v - 1 + this.testimonials.length) % this.testimonials.length);
  }

  next() {
    this.current.update(v => (v + 1) % this.testimonials.length);
  }

  goTo(i: number) {
    this.current.set(i);
  }

  starsArray(n: number) {
    return Array(n).fill(0);
  }

  // Método para validar recomendação
  goToValidationLink(name: string, link: string) {
    if (link) {
      window.open(link, '_blank'); // Abre em nova aba
      // window.location.href = link; // Abre na mesma aba
      console.log(`Validando comentário de: ${name}`);
    }
  }
 
}

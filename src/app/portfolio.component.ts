import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    NavbarComponent, HeroComponent, AboutComponent, SkillsComponent,
    ProjectsComponent, TestimonialsComponent, ContactComponent, FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-skills></app-skills>
      <app-projects></app-projects>
      <app-testimonials></app-testimonials>
      <app-contact></app-contact>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`main { overflow: hidden; }`]
})
export class PortfolioComponent {}
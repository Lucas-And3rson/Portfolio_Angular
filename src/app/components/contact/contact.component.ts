import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  form = { name: '', email: '', message: '' };
  submitted = signal(false);
  error = signal('');

  links = [
    { icon: 'fas fa-envelope', label: 'Email', value: 'devlucasanderson@gmail.com', href: 'https://mail.google.com/mail/?view=cm&fs=1&to=devlucasanderson@gmail.com', color: 'cyan' },
    { icon: 'fab fa-github',   label: 'GitHub', value: 'github.com/Lucas-And3rson', href: 'https://github.com/Lucas-And3rson', color: 'blue' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', value: 'linkedin.com/in/devlucasanderson', href: 'https://linkedin.com/in/devlucasanderson', color: 'purple' },
    { icon: 'fas fa-phone',    label: 'Celular', value: '(87) 9 8176-6743', href: 'https://wa.me/5587981766743', color: 'cyan' },
  ];

  submit() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error.set('Preencha todos os campos.');
      return;
    }
    this.error.set('');
    // In production, integrate with EmailJS, Formspree, or your own backend
    const mailto = `mailto:devlucasanderson@gmail.com?subject=Contato via Portfolio - ${this.form.name}&body=${encodeURIComponent(this.form.message)}%0A%0AEmail: ${this.form.email}`;
    window.open(mailto);
    this.submitted.set(true);
    this.form = { name: '', email: '', message: '' };
    setTimeout(() => this.submitted.set(false), 4000);
  }
}

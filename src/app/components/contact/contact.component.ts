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
  form = { name: '', email: '', phone: '', message: '' };
  submitted = signal(false);
  error = signal('');
  isSubmitting = signal(false); // Sinal para desabilitar o botão enquanto envia

  links = [
    { icon: 'fas fa-phone',    label: 'Celular', value: '(87) 9 8176-6743', href: 'https://wa.me/5587981766743', color: 'cyan' },
    { icon: 'fab fa-github',   label: 'GitHub', value: 'github.com/Lucas-And3rson', href: 'https://github.com/Lucas-And3rson', color: 'blue' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', value: 'linkedin.com/in/devlucasanderson', href: 'https://linkedin.com/in/devlucasanderson', color: 'purple' },
    { icon: 'fas fa-envelope', label: 'Email', value: 'devlucasanderson@gmail.com', href: '', color: 'cyan', disabled: true },
    ];

  async submit() {
    // Validação: Nome, Email e Mensagem continuam obrigatórios (Telefone é opcional)
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.error.set('');
    this.isSubmitting.set(true);

    // Preparando os dados no formato FormData exigido por serviços de email
    const formData = new FormData();
    formData.append('Name', this.form.name);
    formData.append('Email', this.form.email);
    formData.append('WhatsApp/Telefone', this.form.phone || 'Não informado');
    formData.append('Message', this.form.message);
    
    // Configurações extras do FormSubmit para deixar o e-mail profissional
    formData.append('_captcha', 'false'); // Desativa o captcha chato para o usuário
    formData.append('_subject', `💼 Novo contato via Portfólio - ${this.form.name}`);

    try {
      // 💡 Insira o seu email de destino na URL abaixo
      const response = await fetch('https://formsubmit.co/ajax/devlucasanderson@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.submitted.set(true);
        // Limpa o formulário
        this.form = { name: '', email: '', phone: '', message: '' };
        
        // Esconde a mensagem de sucesso após 5 segundos
        setTimeout(() => this.submitted.set(false), 5000);
      } else {
        throw new Error('Erro ao processar o envio.');
      }
    } catch (err) {
      this.error.set('Ocorreu um erro ao enviar a mensagem. Tente novamente ou use as redes sociais.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

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

  // Controla qual campo exibirá a mensagem de bloqueio por segurança
  activeSecurityAlert = signal<'name' | 'email' | 'message' | null>(null);
  private alertTimeout: any;

  // Guarda o último envio para evitar duplicidade idêntica
  private lastSubmission = { email: '', message: '' };

  links = [
    { icon: 'fas fa-phone',    label: 'Celular', value: '(87) 9 8176-6743', href: 'https://wa.me/5587981766743', color: 'cyan' },
    { icon: 'fab fa-github',   label: 'GitHub', value: 'github.com/Lucas-And3rson', href: 'https://github.com/Lucas-And3rson', color: 'blue' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', value: 'linkedin.com/in/devlucasanderson', href: 'https://linkedin.com/in/devlucasanderson', color: 'purple' },
    { icon: 'fas fa-envelope', label: 'Email', value: 'devlucasanderson@gmail.com', href: '', color: 'cyan', disabled: true },
    ];

  // Bloqueia em tempo real a digitação de símbolos perigosos (< > / \ [ ] { } ;)
  onTextInput(event: Event, field: 'name' | 'email' | 'message') {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const originalValue = input.value;
    
    // Regex de caracteres bloqueados
    const blockedRegex = /[<>\/\\\[\]{};]/g;

    // Se o usuário tentou digitar um caractere proibido...
    if (blockedRegex.test(originalValue)) {
      this.triggerSecurityAlert(field);
    }

    // Remove instantaneamente os símbolos
    let filteredValue = originalValue.replace(blockedRegex, '');
    
    // Se for o campo de e-mail, aproveitamos para impedir espaços vazios acidentais
    if (field === 'email') {
      filteredValue = filteredValue.replace(/\s/g, '');
    }

    this.form[field] = filteredValue;
    input.value = filteredValue; // Força a atualização imediata na tela do usuário
  }

  // Ativa o alerta visual no campo específico e define o temporizador de sumiço
  private triggerSecurityAlert(field: 'name' | 'email' | 'message') {
    this.activeSecurityAlert.set(field);
    
    // Limpa o timeout anterior se o usuário continuar digitando símbolos
    if (this.alertTimeout) clearTimeout(this.alertTimeout);

    // Esconde o aviso após 3 segundos
    this.alertTimeout = setTimeout(() => {
      this.activeSecurityAlert.set(null);
    }, 3000);
  }
  
  // Máscara dinâmica para formatar o WhatsApp em tempo real
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove LETRAS e qualquer símbolo digitado

    if (value.length > 11) value = value.substring(0, 11); // Limite rígido de 11 números (padrão BR)

    // Aplica a máscara visual padrão de forma orgânica
    if (value.length > 6) {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    this.form.phone = value;
    input.value = value; // Força a atualização imediata no HTML
  }

  // Higieniza o texto removendo caracteres suspeitos de injeção (XSS)
  private sanitizeInput(text: string): string {
    return text.replace(/[<>\\\/]/g, '').trim();
  }

  // ✉️ Validação estrita de e-mail usando Regex Regex formal
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async submit() {
    // 1. Sanitização inicial dos dados digitados
    const name = this.sanitizeInput(this.form.name);
    const email = this.form.email.trim();
    const phone = this.form.phone.trim();
    const message = this.sanitizeInput(this.form.message);

    // 2. Validação de campos obrigatórios vazios
    if (!name || !email || !message) {
      this.error.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // 3. Validação do formato de e-mail
    if (!this.isValidEmail(email)) {
      this.error.set('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    // 4. Bloqueio de Mensagem Duplicada Idêntica
    if (email === this.lastSubmission.email && message === this.lastSubmission.message) {
      this.error.set('Você já enviou esta exata mensagem recentemente.');
      return;
    }

    // 5. Rate Limit Local (Trava de tempo: Máximo 1 envio a cada 10 minutos)
    const lastSubmitTime = localStorage.getItem('portfolio_submit_time');
    const now = Date.now();
    if (lastSubmitTime && (now - parseInt(lastSubmitTime)) < 10 * 60 * 1000) {
      const minutesLeft = Math.ceil((10 * 60 * 1000 - (now - parseInt(lastSubmitTime))) / 60 / 1000);
      this.error.set(`Por segurança, aguarde ${minutesLeft} minuto(s) para enviar outra mensagem.`);
      return;
    }

    this.error.set('');
    this.isSubmitting.set(true);

    // Preparação do FormData para envio limpo
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Email', email);
    formData.append('WhatsApp/Telefone', phone || 'Não informado');
    formData.append('Message', message);
    
    formData.append('_captcha', 'false');
    formData.append('_honeypot', ''); // Proteção extra na API deles contra bots
    formData.append('_subject', `💼 Novo contato via Portfólio - ${name}`);

    try {
      const response = await fetch('https://formsubmit.co/ajax/devlucasanderson@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        this.submitted.set(true);
        
        // Grava no LocalStorage o timestamp do envio bem-sucedido
        localStorage.setItem('portfolio_submit_time', Date.now().toString());
        
        // Salva o histórico em memória para o filtro de spam idêntico
        this.lastSubmission = { email, message };

        // Limpa o formulário para o usuário
        this.form = { name: '', email: '', phone: '', message: '' };
        
        setTimeout(() => this.submitted.set(false), 5000);
      } else {
        throw new Error();
      }
    } catch (err) {
      this.error.set('Ocorreu um erro ao enviar. Tente novamente ou use o LinkedIn.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

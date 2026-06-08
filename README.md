# Portfolio Lucas Anderson — Angular 18

Portfólio profissional Full Stack Developer.

## ⚡ Setup rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm start
# Acesse: http://localhost:4200

# 3. Build para produção
npm run build:prod
# Saída em: dist/portfolio-lucas-anderson/
```

## 📁 Estrutura

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          # Navbar fixa com glassmorphism
│   │   ├── hero/            # Hero com typing animation
│   │   ├── about/           # Sobre + timeline + contadores
│   │   ├── skills/          # Stack técnico por categoria
│   │   ├── projects/        # Cards de projetos expansíveis
│   │   ├── testimonials/    # Carrossel de depoimentos
│   │   ├── contact/         # Formulário + links de contato
│   │   └── footer/          # Rodapé
│   └── app.component.ts     # Root component
├── styles.scss              # Estilos globais + variáveis CSS
└── index.html               # HTML base + fontes + FontAwesome
```

## 🚀 Deploy

### Vercel (recomendado)
```bash
npm install -g vercel
npm run build:prod
vercel dist/portfolio-lucas-anderson/browser
```

### Netlify
Faça upload da pasta `dist/portfolio-lucas-anderson/browser` no painel.

### Hostinger
Copie o conteúdo de `dist/portfolio-lucas-anderson/browser` para a pasta `public_html`.

## 🎨 Customização

Todas as cores estão em `src/styles.scss` nas variáveis CSS (`:root`).
Para trocar a paleta, edite apenas as variáveis `--accent-cyan`, `--accent-blue`, `--accent-purple`.

## 📬 Formulário de contato

O formulário abre o cliente de email padrão via `mailto:`.
Para envio direto sem abrir email, integre com:
- **Formspree**: https://formspree.io (grátis, sem backend)
- **EmailJS**: https://emailjs.com (grátis até 200 emails/mês)

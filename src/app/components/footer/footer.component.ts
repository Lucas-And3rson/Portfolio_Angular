import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-inner">
        <span class="footer-logo">&lt;Lucas<span>Anderson</span>/&gt;</span>
        <span class="footer-copy">© {{ year }} — Full Stack Developer. Feito com Angular.</span>
        <div class="footer-links">
                <a 
                  href="https://github.com/Lucas-And3rson/Portfolio_Angular"
                  target="_blank"
                  rel="noopener noreferrer">
                  <i class="fab fa-github"></i>
                  <span> Repositório</span>
                </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 28px 0;
      background: var(--bg-secondary);
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-logo {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--text-muted);
      span { color: var(--accent-cyan); }
    }
    .footer-copy {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .footer-links {
      display: flex;
      gap: 16px;
      a {
        color: var(--text-muted);
        font-size: 1rem;
        transition: var(--transition);
        &:hover { color: var(--accent-cyan); transform: translateY(-2px); display: inline-block; }
      }
    }
    @media (max-width: 600px) {
      .footer-inner { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}

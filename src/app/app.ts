import { AfterViewInit, Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy { // Mantemos OnDestroy para limpeza

  protected readonly title = signal('doban');
  private bsDropdownInstance: any;

  // Removemos o @ViewChild

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit disparado. Tentando inicializar Bootstrap.");

    // Usamos setTimeout(0) para garantir a finalização do ciclo de renderização
    setTimeout(() => {
      this.initializeBootstrapDropdown();
    }, 0);
  }

  ngOnDestroy(): void {
    // Limpeza
    if (this.bsDropdownInstance && typeof this.bsDropdownInstance.dispose === 'function') {
      this.bsDropdownInstance.dispose();
    }
  }

  toggleDropdown(): void {
    if (this.bsDropdownInstance && typeof this.bsDropdownInstance.toggle === 'function') {
      this.bsDropdownInstance.toggle();
      console.log('Toggle manual forçado via Angular: Dropdown deve aparecer agora.');
    } else {
      // Caso o usuário clique antes do ngAfterViewInit, embora improvável
      console.error('Instância do Dropdown ainda não está pronta.');
    }
  }

  initializeBootstrapDropdown(): void {
    const toggleElement = document.getElementById('recursosDropdownToggle');

    if (toggleElement && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {

      // **********************************************
      // CRÍTICO: Não precisamos do listener addEventListener('click')
      // pois agora usamos (click)="toggleDropdown()" no HTML.
      // **********************************************

      const existingInstance = (bootstrap as any).Dropdown.getInstance(toggleElement);
      if (existingInstance) {
        existingInstance.dispose();
      }

      // 2. Cria a nova instância
      this.bsDropdownInstance = new (bootstrap as any).Dropdown(toggleElement);
      console.log('Dropdown de Recursos FINALMENTE inicializado.');

      // Removemos o listener de debug antigo daqui!

      return;
    }

    console.error('Falha na inicialização: Elemento "recursosDropdownToggle" não encontrado ou Bootstrap API indisponível.');
  }
}
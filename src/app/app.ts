import { AfterViewInit, Component, ElementRef, OnDestroy, HostListener, ViewChild, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  
  protected readonly title = signal('doban');
  private bsDropdownInstance: any; 

  // Referência ao botão (toggle) e ao menu
  @ViewChild('dropdownToggle') dropdownToggleRef!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenuRef!: ElementRef;

  // --- Lógica de Fechamento ao Clicar Fora (HostListener) ---
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    // 1. Verifica se a instância do Dropdown existe (ou seja, se ele já foi inicializado)
    if (!this.bsDropdownInstance) return;

    const target = event.target as HTMLElement;

    // 2. Verifica se o clique ocorreu FORA do botão de toggle E FORA do menu
    const isClickOutsideToggle = !this.dropdownToggleRef.nativeElement.contains(target);
    const isClickOutsideMenu = !this.dropdownMenuRef.nativeElement.contains(target);

    // Se o clique não foi no botão de toggle E não foi no menu...
    if (isClickOutsideToggle && isClickOutsideMenu) {
      // 3. Chama o método hide() do Bootstrap para fechar o menu
      this.bsDropdownInstance.hide();
      console.log('Dropdown fechado via HostListener.');
    }
  }

  // --- Lógica de Toggle e Inicialização ---

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeBootstrapDropdown();
    }, 0);
  }
  
  ngOnDestroy(): void {
    if (this.bsDropdownInstance && typeof this.bsDropdownInstance.dispose === 'function') {
      this.bsDropdownInstance.dispose();
    }
  }

  initializeBootstrapDropdown(): void {
    const toggleElement = document.getElementById('recursosDropdownToggle');
    
    if (toggleElement && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
        // ... lógica de dispose ...
        this.bsDropdownInstance = new (bootstrap as any).Dropdown(toggleElement);
        console.log('Dropdown inicializado com controle total Angular.');
    } 
  }

  // Novo método para o (click) do Angular
  toggleDropdown(): void {
    if (this.bsDropdownInstance && typeof this.bsDropdownInstance.toggle === 'function') {
      this.bsDropdownInstance.toggle();
      console.log('Toggle manual bem-sucedido.');
    }
  }
}
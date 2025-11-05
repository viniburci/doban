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

  @ViewChild('dropdownToggle') dropdownToggleRef!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenuRef!: ElementRef;

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.bsDropdownInstance) return;

    const target = event.target as HTMLElement;

    const isClickOutsideToggle = !this.dropdownToggleRef.nativeElement.contains(target);
    const isClickOutsideMenu = !this.dropdownMenuRef.nativeElement.contains(target);

    if (isClickOutsideToggle && isClickOutsideMenu) {
      this.bsDropdownInstance.hide();
    }
  }


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
        this.bsDropdownInstance = new (bootstrap as any).Dropdown(toggleElement);
    } 
  }

  toggleDropdown(): void {
    if (this.bsDropdownInstance && typeof this.bsDropdownInstance.toggle === 'function') {
      this.bsDropdownInstance.toggle();
    }
  }
}
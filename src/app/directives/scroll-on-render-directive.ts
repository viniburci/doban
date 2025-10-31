import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollOnRender]'
})
export class ScrollOnRenderDirective {
  private isScrolled = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked() {
    // Só acionamos o scroll uma vez, depois que o DOM foi renderizado
    if (!this.isScrolled) {
      this.isScrolled = true;

      // Usamos Renderer2 para manipular o DOM de forma segura
      this.renderer.setStyle(this.el.nativeElement, 'scroll-behavior', 'smooth');

      // Acessamos diretamente o DOM para fazer o scroll
      this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

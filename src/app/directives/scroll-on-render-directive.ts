import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollOnRender]'
})
export class ScrollOnRenderDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

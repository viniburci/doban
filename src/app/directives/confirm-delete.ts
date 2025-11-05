import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, Injector, output, Renderer2, ViewContainerRef } from '@angular/core';
import { ConfirmDialog } from '../utils/confirm-dialog/confirm-dialog';

@Directive({
  selector: 'button[appConfirmDelete]',
  host: {
    '(click)': 'onConfirmDialog($event)'
  }
})
export class ConfirmDeleteDirective {

  confirmedDelete = output<boolean>()
  private modalComponentRef: ComponentRef<ConfirmDialog> | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private renderer: Renderer2
  ) { console.log('diretiva aplicada') }

  onConfirmDialog(event: MouseEvent): void {
    event.stopImmediatePropagation(); // Impede a ação do clique
    event.preventDefault();  // Impede o clique de ser processado como normalmente seria

    console.log('Diretiva ativada')

    // Criação do componente modal
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmDialog);

    // Insere o modal no ViewContainerRef
    this.modalComponentRef = this.viewContainerRef.createComponent(componentFactory, 0, this.injector);

    // Configura a mensagem do modal diretamente
    //this.modalComponentRef.instance.message = 'Tem certeza que deseja deletar este item?';

    // Quando a confirmação for recebida, emite o valor e remove o componente
    this.modalComponentRef.instance.confirmed.subscribe((confirmed: boolean) => {
      this.confirmedDelete.emit(confirmed);
      this.closeModal(); // Fecha o modal
    });
  }

  // Método para destruir o modal quando a ação for concluída
  closeModal(): void {
    if (this.modalComponentRef) {
      this.modalComponentRef.destroy(); // Remove o componente modal da árvore DOM
    }
  }
}

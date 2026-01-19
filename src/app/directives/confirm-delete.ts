import { ComponentRef, Directive, ElementRef, Injector, output, Renderer2, ViewContainerRef } from '@angular/core';
import { ConfirmDialog } from '../utils/confirm-dialog/confirm-dialog';

@Directive({
  selector: 'button[appConfirmDelete]',
  host: {
    '(click)': 'onConfirmDialog($event)'
  }
})
export class ConfirmDeleteDirective {

  confirmedDelete = output<boolean>();
  private modalComponentRef: ComponentRef<ConfirmDialog> | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private renderer: Renderer2,
    private elementRef: ElementRef // Embora não seja estritamente necessário para esta solução, pode ser útil
  ) { }

  onConfirmDialog(event: MouseEvent): void {
    event.preventDefault(); // Impede o comportamento padrão do botão se houver algum
    event.stopImmediatePropagation();

    // 1. Criação do componente de confirmação no DOM
    this.modalComponentRef = this.viewContainerRef.createComponent<ConfirmDialog>(
      ConfirmDialog,
      { injector: this.injector } // Usar o injector local
    );

    this.modalComponentRef.setInput('message', 'Tem certeza que deseja DELETAR?')

    // 2. Assina o evento de confirmação
    this.modalComponentRef.instance.confirmed.subscribe((confirmed: boolean) => {
      this.confirmedDelete.emit(confirmed);
      this.closeModal(); // Fecha o modal
    });

    // 3. Obtém o elemento nativo do componente modal
    const modalElement = this.modalComponentRef.location.nativeElement;

    // 4. Move o modal para o body para evitar problemas de z-index
    this.renderer.appendChild(document.body, modalElement);

    // 5. Inicializa e exibe o modal usando a API JS do Bootstrap
    const bootstrapModalElement = modalElement.querySelector('.modal');

    if (bootstrapModalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modal = new bootstrap.Modal(bootstrapModalElement);
      modal.show();
      (this.modalComponentRef.instance as any)._bsModalInstance = modal;
    } else {
      console.error('Bootstrap Modal JS não encontrado ou elemento .modal não está na raiz do componente injetado.');
    }
  }

  closeModal(): void {
    if (this.modalComponentRef) {
      // Tenta fechar usando a instância do Bootstrap Modal se ela foi armazenada
      const modalInstance = (this.modalComponentRef.instance as any)._bsModalInstance;
      if (modalInstance && typeof modalInstance.hide === 'function') {
        modalInstance.hide();
        // Adicione um pequeno timeout ou escute o evento 'hidden.bs.modal'
        // para garantir que o modal feche antes de destruir o componente.
        // No entanto, para simplicidade, vamos destruir logo após tentar o hide.
      }

      // Destrói o componente modal da árvore DOM
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}

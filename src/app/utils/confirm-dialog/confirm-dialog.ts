import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {
  
  message = input("Você tem certeza?")
  confirmed = output<boolean>();

  close(confirmed: boolean): void {
    this.confirmed.emit(confirmed);
  }
}

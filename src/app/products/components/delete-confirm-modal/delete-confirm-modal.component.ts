import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  templateUrl: './delete-confirm-modal.component.html',
  styleUrls: ['./delete-confirm-modal.component.scss'],
})
export class DeleteConfirmModalComponent {
  @Input() productName = '';
  @Input() deleting = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal(): void {
    if (this.deleting) {
      return;
    }

    this.cancel.emit();
  }

  deleteProduct(): void {
    if (this.deleting) {
      return;
    }

    this.confirm.emit();
  }
}
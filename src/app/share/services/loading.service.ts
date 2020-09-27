import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public readonly dialog: MatDialog) { }

  // Show loading dialog
  show(title?: string): void {
    this.dialog.open(LoadingDialogComponent, {
      panelClass: 'loading-panel',
      width: '500px',
      disableClose: true,
      data: title ? title : 'Loading...'
    });
  }

  // Hide loading dialog
  hide(): void {
    this.dialog.closeAll();
  }
}

import {Component, inject} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ConfirmDialogData} from './models/confirm-dialog-data.model';

@Component({
    selector: 'app-confirm-dialog',
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatDialogActions
    ],
    templateUrl: 'confirm-dialog.component.html',
    styleUrl: 'confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

    readonly confirmDialogData: ConfirmDialogData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    }

    public confirm() {
        this.dialogRef.close(true);
    }

    public cancel() {
        this.dialogRef.close(false);
    }
}

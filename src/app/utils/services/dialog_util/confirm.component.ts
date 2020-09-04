import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<ConfirmComponent>) {}

  onNoClick(): void {
    this.dialogRef.close({resp:"No"});
  }

  onYesClick(): void {
    this.dialogRef.close({resp:"Yes"});
  }

  ngOnInit() {}

}

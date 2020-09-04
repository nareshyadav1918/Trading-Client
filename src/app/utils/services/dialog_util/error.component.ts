import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<ErrorComponent>) {}

  onOkClick(): void {
    //  this.dialogRef._result = this.data;
    this.dialogRef.close({btn:"No"});
  }


  ngOnInit() {}

}

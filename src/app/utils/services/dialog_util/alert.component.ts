import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<AlertComponent>) {}

  onOkClick(): void {
    //  this.dialogRef._result = this.data;
    this.dialogRef.close({resp:"ok"});
  }


  ngOnInit() {}

}

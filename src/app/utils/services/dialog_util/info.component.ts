import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<InfoComponent>) {}

  onOkClick(): void {
    //  this.dialogRef._result = this.data;
    this.dialogRef.close({btn:"OK"});
  }


  ngOnInit() {}

}

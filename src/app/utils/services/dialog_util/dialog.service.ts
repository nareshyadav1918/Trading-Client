import { Injectable, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';
import { InfoComponent } from './info.component';
import { ErrorComponent } from './error.component';
import { ConfirmComponent } from './confirm.component';
import { ProgressComponent } from './progress.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private matProgressdialogsReferences:Array<any>;
  constructor(private matdialog: MatDialog, private toastrservice: ToastrService) {
    this.matProgressdialogsReferences = [];
  }

  openDialog(comp:any, dialogOptions: any = { width:'300px', disableClose:false, data: {}}){
    const dialogRef = this.matdialog.open(comp, dialogOptions);
    return dialogRef;
  }

  openDialogFromTemplate(templateRef: TemplateRef<any>, dialogOptions: any = { width:'300px', disableClose:false, data: {}}){
    const dialogRef = this.matdialog.open(templateRef, dialogOptions);
    return dialogRef;
  }
  
  
  showAlert(title:string, message:string){
    const dialogRef = this.matdialog.open(AlertComponent, {
      disableClose:true,
      data: {title:title, message:message}
    });
    return dialogRef;
  }

  showError(title:string, message:string){
    const dialogRef = this.matdialog.open(ErrorComponent, {
      disableClose:true,
      data: {title:title, message:message}
    });
    return dialogRef;
  }

  showInfo(title:string, message:string){
    const dialogRef = this.matdialog.open(InfoComponent, {
      disableClose:true,
      data: {title:title, message:message}
    });
    return dialogRef;
  }

  showConfirm(title:string, message:string){
    const dialogRef = this.matdialog.open(ConfirmComponent, {
      disableClose:true,
      data: {title:title, message:message}
    });
    return dialogRef;
  }

  showProgress(message:string){
    const dialogRef = this.matdialog.open(ProgressComponent, {
      width:"auto",
      disableClose:true,
      data: {message:message}
    });
    this.matProgressdialogsReferences.push(dialogRef);
    return dialogRef;
  }

  hideProgress(dialogRef:any = null){
    try{
      if(dialogRef!=null && typeof dialogRef!=="undefined"){
        dialogRef.close();
        return;
      }
    }catch(e){
      return;
    }

    try{
      if(this.matProgressdialogsReferences.length>0){
        let dialog = this.matProgressdialogsReferences.pop();
        dialog.close();
      }
    }catch(e){}
  }

  hildeAllProgresses(){
    if(this.matProgressdialogsReferences.length>0){
      for(let i = 0; i< this.matProgressdialogsReferences.length; i++){
        this.hideProgress(this.matProgressdialogsReferences[i]);
      }
    }
  }

  hideAll(){
     try{
       this.matdialog.closeAll();
     }catch(e){}
  }

  toastr(title:string, message:string, toasttype:string = "success", toastrconfig:any={positionClass:'toast-top-right'}){
    toastrconfig.progressBar = true;
    toastrconfig.enableHtml = true;
    switch(toasttype){
      case "success":
        this.toastrservice.success(message, title, toastrconfig);
      break;
      case "error":
        this.toastrservice.error(message, title, toastrconfig);
      break;
      case "warning":
        this.toastrservice.warning(message, title, toastrconfig);
      break;
      case "info":
        this.toastrservice.info(message, title, toastrconfig);
      break;
    }
  }


}

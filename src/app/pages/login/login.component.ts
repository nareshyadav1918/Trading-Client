import { Component, OnInit, OnDestroy, Renderer2, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Utilities } from '../../utils/utilities.model';
import { InputValidator } from '../../utils/input.validator';
import { DialogService } from '../../utils/services/dialog_util/dialog.service';
import { AppService } from '../../utils/services/app.service';
import { Subscription } from "rxjs";

declare var $: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService]
})
export class LoginComponent implements OnInit, OnDestroy {

  public forgotPassForm: FormGroup;
  forgotPassMode: boolean = false;
  forgotEmail: string = "";
  private subscriptions: Array<Subscription> = [];
  userCredentials: any = { user_name: "", password: "" };
  constructor(private router: Router,
    private renderer: Renderer2, private toastr: ToastrService,
    public dialog: DialogService, public service: AppService) {

  }

  ngOnInit(): void {


  }

  ngOnDestroy() {

    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dialog.hideAll();
  }






  login() {


    let msg = [];
    if (InputValidator.isEmpty(this.userCredentials.user_name)) {
      msg.push("Username is required.");
    }


    if (InputValidator.isEmpty(this.userCredentials.password)) {
      msg.push("Password is required.");
    }

    if (msg.length > 0) {
      let msgStr: string = msg.join("<br/>");
      this.dialog.toastr("Error!", msgStr, "error");
      return;
    }




    let dref = this.dialog.showProgress("Logging to system. Please wait...");
    console.log("Credentials set : ", this.userCredentials);
    let subscription: Subscription = this.service.login(this.userCredentials).subscribe(Response => {
      console.log("After login response : ", Response);
      this.dialog.hideProgress(dref);
      let authResponse: any = Utilities.readKey(Response, "data", {});
      if (authResponse == null || typeof authResponse === "undefined" || !Utilities.readKey(authResponse, "login_success", false)) {
        this.dialog.toastr("Error", "Error in logging into system. User/password may be wrong. Retry...", "error");
      } else {
        window.sessionStorage.setItem('token', JSON.stringify(authResponse));
        this.router.navigate(['/main']);
      }

    }, err => {
      console.log("Error while logging to system : ", err);
      this.dialog.toastr("Error", "Error in logging into system. Retry again.", "error");
      this.dialog.hideProgress(dref);
    });
    this.subscriptions.push(subscription);

    //====================================================================================================================
  }



}

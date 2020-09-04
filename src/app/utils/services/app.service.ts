import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import 'rxjs-compat/add/observable/from';
import 'rxjs-compat/add/observable/of';
import 'rxjs-compat/add/operator/concatMap';
import { Subscription, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Observable } from "rxjs";

import { APP_CONFIG, AppConfig } from "../../app.config";
import { Utilities } from "../utilities.model";
import { DialogService } from './dialog_util/dialog.service';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  public token: string;
  public apiBase = "http://" + location.hostname + "/api/v1";

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient, public dialog: DialogService) { }



  public login(credentials: any): Observable<any> {
    console.log("Auth credential: ", credentials, this.config.apiBase + '/login');
    const myHeaders = new HttpHeaders({
      //'Content-Type':  'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json'
    });
    const formData = new FormData();
    formData.append('username', credentials.user_name);
    formData.append('password', credentials.password);
    return this.http.post<any>(this.config.apiBase + '/login', formData, { headers: myHeaders }).concatMap(data => {
      return Observable.of(data);
    });
  }

  public transactOrder(orderDetails: any): Observable<any> {
    console.log("transactOrder Input: ", orderDetails, this.config.apiBase + '/transact/orders');
    let sToken = this.getToken();
    const myHeaders = new HttpHeaders({
      //'Content-Type':  'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json'
      'Authorization': sToken
    });
    
    const formData = new FormData();
    formData.append('symbol_id', orderDetails.symbol_id);
    formData.append('quantity', orderDetails.quantity);
    formData.append('price', orderDetails.price);

    return this.http.post<any>(this.config.apiBase + '/transact/orders', formData, { headers: myHeaders }).concatMap(data => {
      return Observable.of(data);
    });
  }




  public getAccountSummary(): Observable<any> {
    let sToken = this.getToken();
    //console.log("getAccountSummary token: ", sToken);
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': sToken });
    return this.http.get<any>(this.config.apiBase + '/get/account/details', { headers: myHeaders }).concatMap(data => {
      return Observable.of(data);
    });
  }

  public getInstrumentLiveStockPrice(): Observable<any> {
    let sToken = this.getToken();
    //console.log("getInstrumentLivePrices token: ", sToken);
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': sToken });
    //console.log("getInstrumentLivePrices", this.config.apiBase + '/instrument/live/prices')
    return this.http.get<any>(this.config.apiBase + '/instrument/live/prices?', { headers: myHeaders }).concatMap(data => {
      return Observable.of(data);
    });
  }

  public getExecutedOrders(): Observable<any> {
    let sToken = this.getToken();
    //console.log("getInstrumentLivePrices token: ", sToken);
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': sToken });
    //console.log("getInstrumentLivePrices", this.config.apiBase + '/instrument/live/prices')
    return this.http.get<any>(this.config.apiBase + '/my/executed/orders', { headers: myHeaders }).concatMap(data => {
      return Observable.of(data);
    });
  }

  public hasError(errorObj: any) {
    let err = Utilities.readKey(errorObj, "error", null);
    let hasErr = false;
    if (err != null) {
      hasErr = Utilities.readKey(err, "has_errors", false);
    } else {
      hasErr = Utilities.readKey(errorObj, "has_errors", false);
    }
    return hasErr;
  }

  public getErrorMessages(error: any, joinMessagesBy: string = "<br/>") {
    let errorMsg = { message_keys: [], default_messages: {}, aggregated_message: "" };
    let hasErrors = Utilities.readKey(error, "has_errors", false);
    if (hasErrors) {
      let errors = Utilities.readKey(error, "error_definitions", []);
      let errorsMsgLangKeys = [];
      let defualtMessages = {};
      let aggregateMsg = "";
      for (let i = 0; i < errors.length; i++) {
        errorsMsgLangKeys.push("ERROR_" + errors[i].code);
        defualtMessages["ERROR_" + errors[i].code] = errors[i].message;
        aggregateMsg = aggregateMsg + ((aggregateMsg == "") ? "" : joinMessagesBy) + errors[i].message;
      }
      errorMsg.message_keys = errorsMsgLangKeys;
      errorMsg.default_messages = defualtMessages;
      errorMsg.aggregated_message = aggregateMsg;

    }
    return errorMsg;
  }

  public showApiError(errorObj: any, joinMessagesBy: string = "<br/>") {
    let error = Utilities.readKey(errorObj, "error", null);

    if (error == null) {
      error = errorObj;
    }

    if (this.hasError(error)) {
      let aggregatedMessages = "";
      let errorDetails = this.getErrorMessages(error, joinMessagesBy);
      aggregatedMessages = errorDetails.aggregated_message;
      this.dialog.toastr("Error!", aggregatedMessages, "error");
    }
  }


  getToken() {
    this.token = Utilities.getToken();
    return this.token;
  }


}

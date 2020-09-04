import { Component, OnInit, OnDestroy, Renderer2, ViewEncapsulation, ViewChild, Inject, ElementRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';

import { ToastrService } from 'ngx-toastr';

import { Utilities } from '../../utils/utilities.model';
import { DialogService } from '../../utils/services/dialog_util/dialog.service';

import { AppService } from '../../utils/services/app.service';
import { Subscription } from "rxjs";

import { APP_CONFIG, AppConfig } from '../../app.config';
import { Title } from '@angular/platform-browser';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';


declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("dashboardTabs") tabGroup: MatTabGroup;
  @ViewChild("transactionDialog", { static: true }) transactionDialog: TemplateRef<any>;
  private title: string = "Dashboard";
  user: any = {
    "token": "", "login_success": false, "account_id": "", "first_name": "Unknown", "last_name": "User",
    "email": "", "phone": "", "user_name": ""
  };
  accountDetails: any = {
    "account_id": "", "first_name": "", "last_name": "", "email": "", "phone": "", "user_name": "",
    "password": "", "main_balance": 0.00, "unrealized_balance": 0.00, "unrealized_profit_loss": 0.00
  };
  dashTabIndex: number = 0;
  liveStocks: Array<any> = [];
  executedOrders: Array<any> = [];
  currentHolding: any = {};
  currentHoldingValues:any = {holding_value:0, current_profit:0};
  transactingStockInput: any = { "account_id": "", "symbol_id": "", "symbol_name": "", "quantity": 0, "price": 0, "total_price": 0, "action": "" };
  transactingStock: any = {};
  public pieBalanceDetails = {
    data: [120, 150],
    labels: ['Margin Available', 'Holdings Value'],
    type: 'pie',
    colors: [{ backgroundColor: ['#bbeba8', '#c48809'] }]
  };

  public pieProfitDetails = {
    data: [120, 150],
    labels: ['Profit', 'Loss'],
    type: 'pie',
    colors: [{ backgroundColor: ['#066b28', '#ff0000'] }]
  };

  transactDialogRef: any = null;


  private subscriptions: Array<Subscription> = [];
  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private router: Router, private route: ActivatedRoute, private renderer: Renderer2,
    private toastr: ToastrService, public dialog: DialogService,
    public service: AppService, private titleService: Title) {

    this.user = Utilities.getLoggedUser();
    if (this.user.first_name == null || typeof this.user.first_name === "undefined") this.user.first_name = "Unknown";
    if (this.user.last_name == null || typeof this.user.last_name === "undefined") this.user.last_name = "User";

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log("Dashboard route data : ", data);
    });
    this.loadAccountDetails(true);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-body');
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dialog.hideAll();
  }

  logout() {
    window.sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  onTabChanged(event) {
    console.log("Tab change : ", event);
    this.dashTabIndex = event.index;
  }


  formatMoney(money: number) {
    return Utilities.formatCurrency("<i class=\"fa fa-dollar\"></i>", money);
  }

  openTransactionDialog(theStock: any, action: string = "buy") {
    this.transactingStock = theStock;
    this.transactingStockInput.quantity = 0;
    this.transactingStockInput.price = theStock.current_price;
    this.transactingStockInput.action = action;
    this.transactDialogRef = this.dialog.openDialogFromTemplate(this.transactionDialog, { "max-width": "300px", disableClose: false, data: {} }).afterClosed().subscribe(result => {
      console.log("Result", result);
    });
  }

  calculateTotalCost(){
    let price = Number("" + this.transactingStockInput.price);
    let qty = Number("" + this.transactingStockInput.quantity);
    if(isNaN(price)) price = 0;
    if(isNaN(qty)) qty = 0;
    this.transactingStockInput.total_price = price * qty;
  }

  excuteOrderDialogClose(buttonOption: string) {
    if(!Utilities.isLogged()) { return; }
    if (buttonOption == "OK") {
      console.log("OK action.", this.transactDialogRef);
      let msg: Array<string> = [];
      if (this.transactingStockInput.action == "sell" && Utilities.readKey(this.currentHolding,this.transactingStock.symbol_id,null)==null) {
        msg.push("No instrument available in your holdings to sell.");
      }
     
      if (isNaN(Number("" + this.transactingStockInput.quantity)) || Number("" + this.transactingStockInput.quantity) <= 0) {
        msg.push("Enter valid quantity.");
      }

      if (isNaN(Number("" + this.transactingStockInput.price)) || Number("" + this.transactingStockInput.price) <= 0) {
        msg.push("Enter valid price.");
      }

      let lowPrice: number = Number("" + this.transactingStock.current_price) * .9;
      let highPrice: number = Number("" + this.transactingStock.current_price) * 1.1;

      if (this.transactingStockInput.action == "buy" && (lowPrice > Number("" + this.transactingStockInput.price) || Number("" + this.transactingStockInput.price) > Number("" + this.transactingStock.current_price))) {
        msg.push("Invalid buying price. It must be in-between " + this.formatMoney(lowPrice) + " - " + this.formatMoney(this.transactingStock.current_price)+" (10% low or current price).");
      }

      if (this.transactingStockInput.action == "sell" && (lowPrice > Number("" + this.transactingStockInput.price) || Number("" + this.transactingStockInput.price) > highPrice)) {
        msg.push("Invalid selling price. It must be in-bettween " + this.formatMoney(lowPrice) + " - " + this.formatMoney(highPrice)+" (10% low or high).");
      }

      let total_price = Number("" + this.transactingStockInput.price) * Number("" + this.transactingStockInput.quantity);
      if (msg.length==0 && this.transactingStockInput.action == "buy" && total_price > Number("" + this.accountDetails.main_balance)) {
        msg.push("Insufficient balance in your account to execute this order.");
      }

      if (msg.length==0 && this.transactingStockInput.action == "sell" 
      && Number("" + this.transactingStockInput.quantity)>0 
      && (Utilities.readKey(this.currentHolding,this.transactingStock.symbol_id,null)!=null
      && Number(""+this.currentHolding[this.transactingStock.symbol_id].quantity)<Number("" + this.transactingStockInput.quantity))) {
        msg.push("You can not sell in quantity more than available in your holdings (In holdings: "+this.currentHolding[this.transactingStock.symbol_id].quantity+" Units).");
      }
      //console.log("Inputs : ",this.currentHolding,this.transactingStock.symbol_id);  
      //console.log("Inputs : ",msg, this.transactingStock, this.transactingStockInput,lowPrice,highPrice)
     
      if (msg.length > 0) {
        let aggregatedMessages = msg.join("<br/>");
        this.dialog.toastr("Error!", aggregatedMessages, "error");
        return;
      }
      //{"account_id": "", "symbol_id": "", "symbol_name": "", "quantity": 0, "price": 0, "total_price": 0, "action": ""};
      this.transactingStockInput.account_id = Utilities.getToken();
      this.transactingStockInput.symbol_id = this.transactingStock.symbol_id;
      this.transactingStockInput.symbol_name = this.transactingStock.symbol_name;
      this.transactingStockInput.total_price = Number("" + this.transactingStockInput.price) * Number("" + this.transactingStockInput.quantity);
      this.transactingStockInput.quantity = Number("" + this.transactingStockInput.quantity) * ((this.transactingStockInput.action == "sell") ? -1 : 1);
      delete this.transactingStockInput['action'];
      this.executeOrder(this.transactingStockInput);
      this.dialog.hideAll();

    }
    if (buttonOption == "CANCEL") {
      try {
        this.dialog.hideAll();
      } catch (e) { }
      console.log("CANCEL action.", this.transactDialogRef);
    }
  }

  executeOrder(transactionInput: any) {
    if(!Utilities.isLogged()) { return; }
    let dref = this.dialog.showProgress("Executing order. Please wait...");
    let subscription: Subscription = this.service.transactOrder(transactionInput).subscribe(Response => {
      console.log("executeOrder response : ", Response);
      if (this.service.hasError(Response)) {
        this.service.showApiError(Response);
      } else {
        if(Utilities.readKey(Response,"data.transaction_success", false)){
          this.dialog.toastr("Success", "Order executed.", "success");
        }else{
          this.dialog.toastr("Error", "Failed to execute order. Retry again.", "error");
        }        
      }
    }, err => {
      console.log("Error while executing order : ", err);
      this.dialog.toastr("Error", "Error in executing order. Retry again.", "error");
      this.dialog.hideProgress(dref);      
    });
    this.subscriptions.push(subscription);
  }

  loadAccountDetails(firstLoad: boolean = false) {
    if(!Utilities.isLogged()) { return; }
    let dref = null;
    if (firstLoad) dref = this.dialog.showProgress("Getting account summary. Please wait...");

    let subscription: Subscription = this.service.getAccountSummary().subscribe(Response => {
      //console.log("loadAccountDetails response : ", Response);
      if (dref != null) this.dialog.hideProgress(dref);
      if (this.service.hasError(Response)) {
        if (firstLoad) this.service.showApiError(Response);
      } else {
        this.accountDetails = Utilities.readKey(Response, "data", {});
        this.pieBalanceDetails.data=[Number(""+this.accountDetails.main_balance), Number(""+this.accountDetails.amount_invested)];
          
      
      }
      if (firstLoad) this.getExecutedOrders(firstLoad);

      setTimeout(() => {
        this.loadAccountDetails();
      }, 3000);

    }, err => {
      console.log("Error while logging to system : ", err);
      this.dialog.toastr("Error", "Error in logging into system. Retry again.", "error");
      if (dref != null) this.dialog.hideProgress(dref);
      if (firstLoad) this.getExecutedOrders(firstLoad);

      setTimeout(() => {
        this.loadAccountDetails();
      }, 3000);

    });
    this.subscriptions.push(subscription);
  }

  getInstrumentLiveUpdates(firstLoad: boolean = false) {
    if(!Utilities.isLogged()) { return; }
    let dref = null;
    if (firstLoad) dref = this.dialog.showProgress("Getting live stock. Please wait...");
    let subscription: Subscription = this.service.getInstrumentLiveStockPrice().subscribe((Response) => {
     // console.log("Getting live stock", Response);
      if (dref != null) this.dialog.hideProgress(dref);
      let stockList = Utilities.readKey(Response, "data", null);
      if (this.service.hasError(Response)) {
        if (firstLoad) this.service.showApiError(Response);
      } else {
        if (stockList == null || !Utilities.isArray(stockList)) {
          this.dialog.toastr("Error", "Error while getting live stock.", "error");
        } else {
          this.liveStocks = stockList;
        }
      }
      setTimeout(() => {
        this.getInstrumentLiveUpdates();
      }, 600);
      subscription.unsubscribe();
    }, err => {
      //console.log("Error while fetching booklist : ", err);
      this.dialog.toastr("Error", "Error while fetching live stock.", "error");
      if (dref != null) this.dialog.hideProgress(dref);
      setTimeout(() => {
        this.getInstrumentLiveUpdates();
      }, 2000);
      subscription.unsubscribe();
    });

  }

  getExecutedOrders(firstLoad: boolean = false) {
    if(!Utilities.isLogged()) { return; }
    let dref = null;
    if (firstLoad) dref = this.dialog.showProgress("Getting executed orders. Please wait...");
    let subscription: Subscription = this.service.getExecutedOrders().subscribe((Response) => {
      console.log("Executed order response:", Response);
      if (dref != null) this.dialog.hideProgress(dref);
      let executedOrderList = Utilities.readKey(Response, "data.orders", null);
      let holdings = Utilities.readKey(Response, "data.stock_balance", null);
      if (this.service.hasError(Response)) {
        if (firstLoad) this.service.showApiError(Response);
      } else {
        if (executedOrderList == null || !Utilities.isArray(executedOrderList)) {
          this.dialog.toastr("Error", "Error while getting executed orders.", "error");
        } else {
          this.executedOrders = executedOrderList;
        }

        if (holdings != null && typeof holdings !== "undefined" && Utilities.isArray(holdings)) {
          let myHoldings:any = {};
          let total_holding_value = 0;
          let total_profit = 0;
          //this.currentHolding = {};
          for(let indx in holdings){
            myHoldings[holdings[indx].symbol_id] = holdings[indx]; 
            total_holding_value = total_holding_value + (Number(""+holdings[indx].avg_price) * Number(""+holdings[indx].quantity));  
            myHoldings[holdings[indx].symbol_id].profit =  Number(""+holdings[indx].quantity) * (Number(""+holdings[indx].current_price)-Number(""+holdings[indx].avg_price))     
            total_profit = total_profit +myHoldings[holdings[indx].symbol_id].profit;
          }
          this.currentHolding = Utilities.deepClone(myHoldings);
          this.currentHoldingValues = {holding_value:total_holding_value, current_profit:total_profit};
        } else {
          this.currentHolding = {};
          this.currentHoldingValues = {holding_value:0, current_profit:0};
        }
      }
      if (firstLoad) this.getInstrumentLiveUpdates(firstLoad);
      setTimeout(() => {
        this.getExecutedOrders();
      }, 2000);


    }, err => {
      console.log("Error while fetching booklist : ", err);
      this.dialog.toastr("Error", "Error while fetching executed order list. Retry again.", "error");
      if (dref != null) this.dialog.hideProgress(dref);
      if (firstLoad) this.getInstrumentLiveUpdates(firstLoad);
      setTimeout(() => {
        this.getExecutedOrders();
      }, 2000);

    });
    this.subscriptions.push(subscription);
  }

  hasHoldings(){
    return Utilities.objSize(this.currentHolding)>0;
  }

  

  unsorted(){}
}

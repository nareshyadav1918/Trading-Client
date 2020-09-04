import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from "@angular/router";
import { Utilities } from '../utilities.model';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {

  constructor(private router: Router) { }

  public getRouteTitle(): string {
    return this.getRouteData("title");
  }

  public getRouteData(paramName: string): any {
    const root = this.router.routerState.snapshot.root;
    let val= Utilities.readKey(this.lastChild(root), "data."+paramName, "");
    return val;
  }

  private lastChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (route.firstChild) {
      return this.lastChild(route.firstChild);
    } else {
      return route;
    }
  }
}

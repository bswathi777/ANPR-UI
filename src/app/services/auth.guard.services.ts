import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { GlobalServices } from "./global.service";

@Injectable()

export class AuthguardService implements CanActivate{
    constructor(private router: Router, private globalservice: GlobalServices){
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if(localStorage.getItem('ANPRAuthentication') || this.globalservice.isHasLoggedInSession()){
            return true;
        }
        else{
            window.location.href = this.globalservice.domain;
            return false;
        }
    }
}
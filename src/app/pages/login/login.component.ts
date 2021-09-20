import { GlobalServices } from './../../services/global.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public form:FormGroup;
  public settings: Settings;
  Businesstype: any[] = [];

  constructor(public appSettings:AppSettings, public router:Router, 
    public globalService: GlobalServices, private route: ActivatedRoute){
    this.settings = this.appSettings.settings; 

    this.route.queryParams.subscribe(params => {

      if (params['code'] == undefined && params['response_type'] == undefined && params['redirect_uri'] == undefined) {
        var data = this.globalService.getLocalItem("ANPRAuthentication", true);
   
        if(data == null){
          this.globalService.logout();
        }else{
          this.router.navigate(['/maindashboard']);
        }
      } else {
        this.globalService.removeLocalItem('ANPRAuthentication');
        localStorage.setItem('redirect_usermngt', params['redirect_uri']);

        let data = atob(params['response_type']);
        let res = JSON.parse(data);

        if (res['success'] == '1') {
          this.globalService.setLocalItem('ANPRAuthentication', res, true);
          this.globalService.init();
          this.router.navigate(['/main-dashboard']);
        } else if (res['success'] == '0') {
          console.log(res['message']);
        }
      }
    });  
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
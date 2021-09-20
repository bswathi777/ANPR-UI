import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent{

  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router, public fb: FormBuilder) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit(){
   
  }

  

  public goHome(): void {
    this.router.navigate(['/main-dashboard']);
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
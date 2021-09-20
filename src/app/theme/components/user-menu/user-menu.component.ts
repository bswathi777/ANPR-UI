import { GlobalServices } from './../../../services/global.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  
  public userImage = "assets/img/users/default-user.jpg";
  username: string;
  roles: any;
  show_usrmngt: boolean;

  constructor(private globalServices: GlobalServices) {
    let user = this.globalServices.getLocalItem('ANPRAuthentication', true)['data'];
    console.log(user,'user');
    
    this.username = user['firstname'] + " " + user['lastname'];
    this.roles = user['app_details']['roles'];
    let show_usermngt = user['user_management'];

    if (show_usermngt == "yes") {
      this.show_usrmngt = true;
    } else {
      this.show_usrmngt = false;
    }
  }

  ngOnInit() {
  }

  openUserMngt() {
    this.globalServices.userManagementPage();
  }

  userLogout() {
    this.globalServices.logout();
  }

}

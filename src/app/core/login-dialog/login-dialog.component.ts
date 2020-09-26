import { Quote, QuoteService } from './../../share/quote.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { LoginService } from './login.service';
import { MatDialogRef } from '@angular/material/dialog';
declare var FB;
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  // Quote that will be shown on HTML
  selectedQuote: Quote;
  // Quotes array that will be shown to user randomly
  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private loginService: LoginService,
              public readonly quoteService: QuoteService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.selectedQuote = this.quoteService.getQuote();
  }

  fbLogin() {
    FB.login(
      (response) => {
        console.log('FB response', response);
        if (response.status === 'connected') {
          this.getFBDetail();
        } else {
          localStorage.clear();
          // TODO: Show warning message
          this.dialogRef.close(false);
        }
      }, {scope: 'public_profile,email,user_link'}
    );
  }

  getFBDetail(): void {
    FB.api('/me', { fields: 'name,email' }, (response) => {
      console.log('Successful login in for: ' + response.name, response);
      this.loginService.login(response.id, response.email, response.name)
          .subscribe(
            res => {
              console.log('res', res);
              localStorage.setItem('userObj', JSON.stringify(res));
              // Store user info in localStorage
              this.ngZone.run(() => {
                console.log('closing dialog')
                this.dialogRef.close(true);
              });
            },
            err => {
              localStorage.clear();
              if (err.error) {
                console.error(err.error);
                this.dialogRef.close(false);
                // TODO: Show error message
              }
            }
          );
    });
  }
}

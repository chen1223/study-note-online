import { HttpClient } from '@angular/common/http';
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
  selectedQuote = null;
  // Quotes array that will be shown to user randomly
  quotes = [
    {
      line: 'The expert in everything was once a beginner.',
      author: null
    },
    {
      line: 'The secret to getting ahead is getting started.',
      author: null
    },
    {
      line: 'Success is the sum of small efforts, repeated day in and day out.',
      author: 'Robert Collier'
    },
    {
      line: 'Start where you are. Use what you have. Do what you can.',
      author: 'Arthur Ashe'
    },
    {
      line: 'There are no shortcuts to any place worth going.',
      author: 'Beverly Sills'
    },
    {
      line: 'Strive for progress, not perfection',
      author: null
    }
  ];
  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private loginService: LoginService,
              private http: HttpClient,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.selectedQuote = this.randomQuotes();
  }

  // Return a ranom quotes from the quotes pool
  randomQuotes(): object {
    const index = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[index];
    return quote;
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

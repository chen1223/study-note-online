import { Component, OnInit } from '@angular/core';
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
  constructor() { }

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
        if (response.status === 'connected'){
          const fbid = response.authResponse.userID;
          const fb_token = response.authResponse.accessToken;
          // this.router.navigate(['/']);
          // this.register();
        }
      }
    );
  }
}

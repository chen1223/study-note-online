import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  quotes: Array<Quote> = [
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

  // Return a ranom quotes from the quotes pool
  getQuote(): Quote {
    const index = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[index];
    return quote;
  }
}

export interface Quote {
  line: string;
  author: string | null;
}

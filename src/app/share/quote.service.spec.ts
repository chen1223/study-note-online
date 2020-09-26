import { TestBed } from '@angular/core/testing';

import { QuoteService } from './quote.service';

describe('QuoteService', () => {
  let service: QuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuoteService);
  });

  it('should have a quotes array', () => {
    expect(service.quotes).toBeTruthy();
  });

  /**
   * getQuote related tests
   */
  it('should define a function called getQuote', () => {
    expect(service.getQuote).toBeDefined();
  });
  it('should return a random quote when getQuote is called', () => {
    const result = service.getQuote();
    const filterQuotes = service.quotes.filter(item => {
      return (item.line === result.line) && (item.author === result.author);
    });
    expect(filterQuotes.length).toBeGreaterThan(0);
  });
});

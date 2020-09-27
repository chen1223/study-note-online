import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LoginService } from './login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuoteService } from '../../share/services/quote.service';

class MockLoginService {
  login(fbid, email, name) {
    return of({});
  }
}

class MockMatDialogRef {
  close(data: any) {}
}

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let quote;
  let mockLoginService: LoginService;
  let quoteService: QuoteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogComponent ],
      imports: [
        MatDialogModule,
        FontAwesomeModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: QuoteService },
        { provide: LoginService, useClass: MockLoginService },
        { provide: MatDialogRef, useClass: MockMatDialogRef }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    mockLoginService = TestBed.inject(LoginService);
    quoteService = TestBed.inject(QuoteService);
    fixture.detectChanges();
    quote = {
      line: 'An apple a day, keeps a doctor away.',
      author: 'Doctor Who'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain brand icon on the HTML', () => {
    const el = fixture.debugElement.query(By.css('.brand-icon'));
    expect(el).toBeTruthy();
  });

  /**
   * Quote related tests
   */
  it('should have property: selectedQuote', () => {
    expect(component.selectedQuote).toBeDefined();
  });
  it('should show quote on HTML', () => {
    // Test if the css class 'quote' can be found on the HTML
    const el = fixture.debugElement.query(By.css('.quote'));
    expect(el).toBeTruthy();
    // Test if quote is rendered correctly on the HTML
    component.selectedQuote = quote;
    fixture.detectChanges();
    expect((el.nativeElement as HTMLSpanElement).innerText).toBe(quote.line);
  });
  it('should show quote author on the HTML', () => {
    component.selectedQuote = quote;
    fixture.detectChanges();
    const authorEl = fixture.debugElement.query(By.css('.author'));
    expect(authorEl).toBeTruthy();
    expect((authorEl.nativeElement as HTMLSpanElement).innerText).toBe(quote.author);
  });
  it('should not show quote author on the HTML when author is null', () => {
    quote.author = null;
    component.selectedQuote = quote;
    fixture.detectChanges();
    const authorEl = fixture.debugElement.query(By.css('.author'));
    expect(authorEl).toBeFalsy();
  });
  it('should call getQuote from QuoteService on ngOnInit', () => {
    const fnc = spyOn(quoteService, 'getQuote');
    component.ngOnInit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should save quote to selectedQuote when getQuote is called', () => {
    component.selectedQuote = null;
    fixture.detectChanges();
    const dummyQuote = {
      line: '123',
      author: 'John Doe'
    };
    spyOn(quoteService, 'getQuote').and.callFake(() => {
      return dummyQuote;
    });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.selectedQuote).toEqual(dummyQuote);
  });

  /**
   * Facebook button related test
   */
  it('should show facebook button on the HTML', () => {
    const el = fixture.debugElement.query(By.css('.fbBtn'));
    expect(el).toBeTruthy();
  });
  it('should call fbLogin on facebook button clicked', () => {
    const btn = fixture.debugElement.query(By.css('.fbBtn')).nativeElement as HTMLButtonElement;
    const fnc = spyOn(component, 'fbLogin').and.callFake(() => {});
    btn.click();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });

  /**
   * getFBDetail function related tests
   */
  it('should have function called getFBDetail', () => {
    expect(component.getFBDetail).toBeDefined();
  });
});

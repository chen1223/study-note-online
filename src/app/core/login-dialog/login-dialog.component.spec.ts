import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { By } from '@angular/platform-browser';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let quote;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogComponent ],
      imports: [
        MatDialogModule,
        FontAwesomeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
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
   * Random quote related tests
   */
  it('should contain an array of quotes', () => {
    expect(component.quotes).toBeTruthy();
    expect(component.quotes.length).toBeGreaterThan(0);
  });
  it('should define a function that return quotes randomly - randomQuotes', () => {
    expect(component.randomQuotes).toBeTruthy();
    const output = component.randomQuotes();
    fixture.detectChanges();
    expect(output).toBeInstanceOf(Object);
  });

  /**
   * Quote related tests
   */
  it('should have property: selectedQuote', () => {
    expect(component.selectedQuote).toBeDefined();
  });
  it('should call randomQuotes function to set selectedQuote on ngInit', () => {
    expect(component.selectedQuote).toBeDefined();
    const fnc = spyOn(component, 'randomQuotes');

    component.ngOnInit();

    expect(fnc).toHaveBeenCalled();
    expect(component.selectedQuote).not.toBeNull();
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
});

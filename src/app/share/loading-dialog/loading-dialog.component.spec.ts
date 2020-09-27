import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDialogComponent } from './loading-dialog.component';
import { QuoteService } from '../services/quote.service';

describe('LoadingDialogComponent', () => {
  let component: LoadingDialogComponent;
  let fixture: ComponentFixture<LoadingDialogComponent>;
  let quoteService: QuoteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoadingDialogComponent
      ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: QuoteService },
        { provide: MAT_DIALOG_DATA, useValue: 'Loading...' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingDialogComponent);
    component = fixture.componentInstance;
    quoteService = TestBed.inject(QuoteService);
    fixture.detectChanges();
  });

  it('should have property called selectedQuote', () => {
    expect(component.selectedQuote).toBeDefined();
  });

  it('should call getQuote function of QuoteService in ngOnInit', () => {
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
    spyOn(quoteService, 'getQuote').and.returnValue(dummyQuote);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.selectedQuote).toEqual(dummyQuote);
  });
});

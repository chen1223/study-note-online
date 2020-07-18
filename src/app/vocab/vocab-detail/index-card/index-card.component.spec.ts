import { MaterialModule } from './../../../share/material.module';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { IndexCardComponent } from './index-card.component';
import { Input } from '@angular/core';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('IndexCardComponent', () => {
  let component: IndexCardComponent;
  let fixture: ComponentFixture<IndexCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexCardComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Input related tests
   */
  it('should have input called mode', () => {
    expect(component.mode).toBeDefined();
  });
  it('should have input called vocabs', () => {
    expect(component.vocabs).toBeDefined();
  });

  /**
   * Index card HTML render related tests
   */
  it('should redner front and back for each vocab', () => {
    component.vocabs = new FormArray([new FormGroup({
      vocab: new FormControl('test'),
      desc: new FormControl('123'),
      frontOnTop: new FormControl(true)
    })]);
    fixture.detectChanges();
    const frontWrapper = fixture.debugElement.query(By.css('.card__wrapper--front'));
    const backWrapper = fixture.debugElement.query(By.css('.card__wrapper--back'));
    expect(frontWrapper).toBeTruthy();
    expect(backWrapper).toBeTruthy();
    const frontCard = frontWrapper.nativeElement.querySelector('.card--front');
    const backCard = backWrapper.nativeElement.querySelector('.card--back');
    expect(frontCard).toBeTruthy();
    expect(backCard).toBeTruthy();
  });
  it('shoud render data on the HTML', () => {
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('test'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('book'),
        desc: new FormControl('book 123'),
        frontOnTop: new FormControl(true)
      })
    ]);
    fixture.detectChanges();
    const cardEls = fixture.debugElement.queryAll(By.css('.card'));
    expect(cardEls.length).toEqual(component.vocabs.length);
    // Test content
    cardEls.forEach(el => {
      const vocab = el.query(By.css('.vocab'));
      const desc = el.query(By.css('.desc'));
      expect(vocab).toBeTruthy();
      expect(desc).toBeTruthy();
    });
  });

  /**
   * Flip button related tests
   */
  it('should render flip button on the HTML', () => {
    component.vocabs = new FormArray([new FormGroup({
      vocab: new FormControl('test'),
      desc: new FormControl('123'),
      frontOnTop: new FormControl(true)
    })]);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.flip-btn'));
    expect(el).toBeTruthy();
    expect(el.nativeElement).toHaveClass('round-btn');
    expect(el.nativeElement.getAttribute('aria-label')).toBe('flip card');
    const faIcon = el.nativeElement.querySelector('fa-icon');
    expect(faIcon).toBeTruthy();
  });
  it('should bind flipCard function to the flip button', () => {
    expect(component.flipCard).toBeDefined();
    component.vocabs = new FormArray([new FormGroup({
      vocab: new FormControl('test'),
      desc: new FormControl('123'),
      frontOnTop: new FormControl(true)
    })]);
    fixture.detectChanges();
    const fnc = spyOn(component, 'flipCard');
    const flipBtn = fixture.debugElement.query(By.css('.flip-btn'));
    flipBtn.triggerEventHandler('click', 0);
    expect(fnc).toHaveBeenCalled();
  });
  it('should flip the card at specified index on flipCard called', () => {
    component.vocabs = new FormArray([new FormGroup({
      vocab: new FormControl('test'),
      desc: new FormControl('123'),
      frontOnTop: new FormControl(true)
    })]);
    fixture.detectChanges();
    component.flipCard(0);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('.card'));
    expect(card.nativeElement).not.toHaveClass('front');
  });

  /**
   * Remove button related tests
   */
  it('should have remove button on each card', () => {
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('test'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('book'),
        desc: new FormControl('book 123'),
        frontOnTop: new FormControl(true)
      })
    ]);
    fixture.detectChanges();
    // Verify remove buttons renders correct number
    const cardEls = fixture.debugElement.queryAll(By.css('.card'));
    expect(cardEls.length).toEqual(component.vocabs.length);
    const removeBtns = fixture.debugElement.queryAll(By.css('.remove-btn'));
    expect(removeBtns.length).toEqual(component.vocabs.length);
    // Verify each remove button have the 'round-btn' class
    removeBtns.forEach(btn => {
      expect(btn.nativeElement.classList).toContain('round-btn');
      expect(btn.nativeElement.classList).toContain('sub-btn');
      expect(btn.nativeElement.getAttribute('aria-label')).toEqual('remove card');
      // Each remove button should have fontawesome icon
      const icon = btn.nativeElement.querySelector('fa-icon');
      expect(icon).toBeTruthy();
    });
  });
  it('should define onRemoveClick function', () => {
    expect(component.onRemoveClick).toBeTruthy();
    const fnc = spyOn(component, 'onRemoveClick').and.callThrough();
    const index = 0;
    component.onRemoveClick(index);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalledWith(index);
    // Test missing input
    component.onRemoveClick(null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalledWith(null);
  });
  it('should remove item from the vocabs array when onRemoveClick is called', () => {
    const vocab1Title = 'vocab1';
    const vocab2Title = 'vocab2';
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl(vocab1Title),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl(vocab2Title),
        desc: new FormControl('book 123'),
        frontOnTop: new FormControl(true)
      })
    ]);
    fixture.detectChanges();
    component.onRemoveClick(0);
    fixture.detectChanges();
    const vocabArray = component.vocabs as FormArray;
    expect(vocabArray.length).toBe(1);
    const remainingVocabTitle = vocabArray.at(0).get('vocab').value;
    expect(remainingVocabTitle).toBe(vocab2Title);
  });
  it('should not show remove button when there is only 1 card left', () => {
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      })
    ]);
    fixture.detectChanges();
    const removeBtns = fixture.debugElement.queryAll(By.css('.remove-btn'));
    expect(removeBtns.length).toEqual(0);
  });
});

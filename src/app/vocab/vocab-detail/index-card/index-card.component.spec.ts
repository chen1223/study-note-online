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
    const front = fixture.debugElement.query(By.css('.card--front'));
    const back = fixture.debugElement.query(By.css('.card--back'));
    expect(front).toBeTruthy();
    expect(back).toBeTruthy();
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
   * Index card rendering test
   */
  it('should render index card to correct ratio', () => {
    expect(component.renderCard).toBeDefined();
    const fnc = spyOn(component, 'renderCard');
    component.vocabs = new FormArray([new FormGroup({
      vocab: new FormControl('test'),
      desc: new FormControl('123')
    })]);
    component.ngAfterViewInit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should bind flip class to the frontOnTop property', () => {
    expect(component.prepareData).toBeDefined();
    const fnc = spyOn(component, 'prepareData');
    component.ngOnInit();
    expect(fnc).toHaveBeenCalled();
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
});

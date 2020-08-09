import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from './../../../share/material.module';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { IndexCardComponent } from './index-card.component';
import { Input, SimpleChanges, SimpleChange } from '@angular/core';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

describe('IndexCardComponent', () => {
  let component: IndexCardComponent;
  let fixture: ComponentFixture<IndexCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexCardComponent ],
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
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
  it('should have input called presentationMode', () => {
    expect(component.presentationMode).toBeDefined();
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
  it('should not show remove button in view mode', () => {
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      })
    ]);
    component.mode = 'view';
    fixture.detectChanges();
    const removeBtns = fixture.debugElement.queryAll(By.css('.remove-btn'));
    expect(removeBtns.length).toEqual(0);
  });

  it('should not show card title in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const titles = fixture.debugElement.queryAll(By.css('.card__title'));
    expect(titles.length).toEqual(0);
  });

  /**
   * Presentation mode related tests
   */
  it('should have carousel list in presentation mode', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.carousel-list'));
    expect(el).toBeTruthy();
  });
  it('should have three carousel items at all time: prev, next, selected, prep', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    const prevEl = fixture.debugElement.query(By.css('.carousel-item.--prev'));
    expect(prevEl).toBeTruthy();
    const selectedEl = fixture.debugElement.query(By.css('.carousel-item.--selected'));
    expect(selectedEl).toBeTruthy();
    const nextEl = fixture.debugElement.query(By.css('.carousel-item.--next'));
    expect(nextEl).toBeTruthy();
  });
  it('should define selectedVocab', () => {
    expect(component.selectedVocab).toBeDefined();
  });
  it('should define index of each carousel item', () => {
    expect(component.selectedIndex).toBeDefined();
    expect(component.prevIndex).toBeDefined();
    expect(component.nextIndex).toBeDefined();
  });
  it('should define carouselItemArray', () => {
    expect(component.carouselItemArray).toBeDefined();
  });
  it('should define initCarousel', () => {
    expect(component.initCarousel).toBeDefined();
  });
  it('should call initCarousel when presentationMode is set to true', () => {
    const fnc = spyOn(component, 'initCarousel').and.callFake(() => {});
    component.ngOnChanges({
      presentationMode: new SimpleChange(false, true, false)
    });
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should prepare correct initial carousel list', () => {
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab2'),
        desc: new FormControl('234'),
        frontOnTop: new FormControl(true)
      })
    ]);
    component.initCarousel();
    fixture.detectChanges();
    const vocabs = component.vocabs.getRawValue();
    expect(component.selectedVocab).toEqual(vocabs[0]);
  });
  it('should have carousel controls', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    const prevBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--prev'));
    expect(prevBtn).toBeTruthy();
    expect(prevBtn.nativeElement.getAttribute('aria-label')).toContain('Previous');
    const nextBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--next'));
    expect(nextBtn).toBeTruthy();
    expect(nextBtn.nativeElement.getAttribute('aria-label')).toContain('Next');
    const flipBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--flip'));
    expect(flipBtn).toBeTruthy();
    expect(flipBtn.nativeElement.getAttribute('aria-label')).toContain('Flip');
  });
  it('should bind onCarouselFlip to the carousel flip button', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    expect(component.onCarouselFlip).toBeDefined();
    const fnc = spyOn(component, 'onCarouselFlip');
    const flipBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--flip'));
    flipBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should bind onCarouselRotate to the carousel prev button', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    expect(component.onCarouselRotate).toBeDefined();
    const fnc = spyOn(component, 'onCarouselRotate');
    const prevBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--prev'));
    prevBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalledWith('prev');
  });
  it('should bind onCarouselRotate to the carousel next button', () => {
    component.mode = 'view';
    component.presentationMode = true;
    fixture.detectChanges();
    expect(component.onCarouselRotate).toBeDefined();
    const fnc = spyOn(component, 'onCarouselRotate');
    const nextBtn = fixture.debugElement.query(By.css('.carousel-ctrl.--next'));
    nextBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalledWith('next');
  });
  it('should flip selectedVocab when onCarouselFlip is called', () => {
    component.mode = 'view';
    component.presentationMode = true;
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
    ]);
    component.initCarousel();
    fixture.detectChanges();

    component.onCarouselFlip();
    expect(component.selectedVocab.frontOnTop).toBeFalsy();
  });
  it('should add all index by 1 when onCarouselRotate is called with next', () => {
    component.selectedIndex = 0;
    component.nextIndex = 1;
    component.prevIndex = 2;
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab2'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab3'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
    ]);
    fixture.detectChanges();
    component.onCarouselRotate('next');
    fixture.detectChanges();
    expect(component.selectedIndex).toEqual(1);
    expect(component.nextIndex).toEqual(2);
    expect(component.prevIndex).toEqual(0);
  });
  it('should minus all index by 1 when onCarouselRotate is called with prev', () => {
    component.selectedIndex = 0;
    component.nextIndex = 1;
    component.prevIndex = 2;
    component.vocabs = new FormArray([
      new FormGroup({
        vocab: new FormControl('vocab1'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab2'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
      new FormGroup({
        vocab: new FormControl('vocab3'),
        desc: new FormControl('123'),
        frontOnTop: new FormControl(true)
      }),
    ]);
    fixture.detectChanges();
    component.onCarouselRotate('prev');
    fixture.detectChanges();
    expect(component.selectedIndex).toEqual(2);
    expect(component.nextIndex).toEqual(0);
    expect(component.prevIndex).toEqual(1);
  });
});

import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../share/material.module';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { VocabDetailComponent } from './vocab-detail.component';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IndexCardComponent } from './index-card/index-card.component';

@Component({
  selector: 'app-breadcrumb',
  template: ''
})
export class MockBreadcrumbComponent {}

class MockActivatedRoute {
  data = of({
    mode: 'create'
  });
}

@Component({
  selector: 'app-index-card',
  template: `
    <div class="card-wrapper">
      <div class="card--front">
        <input class="ctrl">
      </div>
    </div>
  `
})
export class MockIndexCardComponent {
  @Input() mode = '';
  @Input() vocabs = [];
}

describe('VocabDetailComponent', () => {
  let component: VocabDetailComponent;
  let fixture: ComponentFixture<VocabDetailComponent>;
  let router: Router;
  let mockActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VocabDetailComponent,
        MockBreadcrumbComponent,
        MockIndexCardComponent
      ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([
          {
            path: 'vocab/new',
            component: VocabDetailComponent,
            data: {
              mode: 'create'
            }
          },
          {
            path: 'vocab/view/:id',
            component: VocabDetailComponent,
            data: {
              mode: 'view'
            }
          },
          {
            path: 'vocab/update/:id',
            component: VocabDetailComponent,
            data: {
              mode: 'update'
            }
          }
        ])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    (component.form.get('vocabs') as FormArray).clear();
    fixture.detectChanges();
  });

  /**
   * Mode related tests
   */
  it('should call setMode on page init', () => {
    expect(component.activatedRoute).toBeDefined();
    expect(component.setMode).toBeDefined();
    const fnc = spyOn(component, 'setMode').and.callFake(() => {});
    component.ngOnInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });

  /**
   * Create mode related tests
   */
  it('should set mode to create mode when the url has the new keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    // Create mode test
    router.navigateByUrl('vocab/new');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('create');
  }));
  it('should clear form on resetForm called', () => {
    // Test if resetForm is defined
    expect(component.resetForm).toBeTruthy();
    const form = component.form as FormGroup;
    form.get('title').setValue('dummy title');
    const vocabArray = form.get('vocabs') as FormArray;
    vocabArray.push(new FormGroup({
      vocab: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required)
    }));
    fixture.detectChanges();
    component.resetForm();
    fixture.detectChanges();
    expect(form.get('title').value).toBeNull();
    expect(vocabArray.length).toEqual(0);
  });
  it('should reset form in create mode', fakeAsync(() => {
    const fnc = spyOn(component, 'resetForm');
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    // Create mode test
    router.navigateByUrl('vocab/new');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('create');
    expect(fnc).toHaveBeenCalled();
  }));
  it('should enable form in create mode', fakeAsync(() => {
    const form = component.form as FormGroup;
    form.disable();
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    // Create mode test
    router.navigateByUrl('vocab/new');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('create');
    expect(form.enabled).toBeTruthy();
  }));
  it('should call the addVoab function in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    const fnc = spyOn(component, 'addVocab').and.callThrough();
    component.ngOnInit();
    expect(fnc).toHaveBeenCalledWith(false);
  });
  it('should set focus on the title input in create mode', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.setMode();
    fixture.detectChanges();
    tick();
    const titleEl = fixture.debugElement.query(By.css('.ctrl-wrapper.--title .ctrl'));
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl.nativeElement).toBe(titleEl.nativeElement);
  }));

  /**
   * View mode related tests
   */
  it('should set mode to view mode when the url has the view keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    // View mode test
    router.navigateByUrl('vocab/view/1');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('view');
  }));

  /**
   * Update mode related test
   */
  it('should mode to update mode when the url has the update mode keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    // Update mode test
    router.navigateByUrl('vocab/update/1');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('update');
  }));

  /**
   * Back button related tests
   */
  it('should have back link in the HTML', () => {
    const el = fixture.debugElement.query(By.css('.back-link'));
    expect(el).toBeTruthy();
  });
  it('should return to previous page on back called', () => {
    expect(component.back).toBeDefined();
    expect(component.location).toBeDefined();
    const fnc = spyOn(component.location, 'back' as any);
    component.back();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should bind the back function to the back link', () => {
    const backLink = fixture.debugElement.query(By.css('.back-link'));
    const fnc = spyOn(component, 'back').and.callFake(() => {});
    backLink.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });

  /**
   * Save/Cancel button related tests
   */
  it('should have save button and cancel button in the HTML', () => {
    const saveBtn = fixture.debugElement.query(By.css('.save-btn'));
    const cancelBtn = fixture.debugElement.query(By.css('.cancel-btn'));
    expect(saveBtn).toBeTruthy();
    expect(cancelBtn).toBeTruthy();
  });

  /**
   * Page title related tests
   */
  it('should have page title: New Vocabulary Pack in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('New Vocabulary Pack');
    expect(component.title).toEqual('New Vocabulary Pack');
  });
  it('should have page title: View Vocabulary Pack in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('View Vocabulary Pack');
    expect(component.title).toEqual('View Vocabulary Pack');
  });
  it('should have page title: Update Vocabulary Pack in update mode', () => {
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('Update Vocabulary Pack');
    expect(component.title).toEqual('Update Vocabulary Pack');
  });

  /**
   * Form related tests
   */
  it('should define form', () => {
    expect(component.fb).toBeDefined();
    expect(component.fb).toBeInstanceOf(FormBuilder);
    expect(component.form).toBeDefined();
    const el = fixture.debugElement.query(By.css('form'));
    expect(el).toBeTruthy();
  });
  it('should define a FormControl called title with required validation', () => {
    expect(component.form.get('title')).toBeTruthy();
    expect(component.form.get('title')).toBeInstanceOf(FormControl);
    const el = fixture.debugElement.query(By.css('.title-ctrl'));
    expect(el).toBeTruthy();

    // Validation test
    component.form.get('title').setValue(null);
    fixture.detectChanges();
    expect(component.form.get('title').invalid).toBeTruthy();
  });
  it('should define a FormArray called vocabs', () => {
    const formArray = component.form.get('vocabs');
    expect(formArray).toBeTruthy();
  });
  it('should initialize 1 item in vocabs formarray in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    const vocabArray = component.form.get('vocabs') as FormArray;
    vocabArray.clear();
    component.ngOnInit();
    fixture.detectChanges();
    expect(vocabArray.length).toBe(1);
  });

  /**
   * Add vocab function related tests
   */
  it('should add push one item to formarray on addVocab called', () => {
    expect(component.addVocab).toBeDefined();
    const vocabArray = component.form.get('vocabs') as FormArray;
    vocabArray.clear();
    fixture.detectChanges();
    component.addVocab();
    fixture.detectChanges();
    expect(vocabArray.length).toBe(1);
  });
  it('should set focus to the new index card on addVocab called', fakeAsync(() => {
    component.addVocab();
    fixture.detectChanges();
    tick();
    const lastCardCtrl = fixture.debugElement.query(By.css('.card-wrapper:last-child .card--front .ctrl'));
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl.nativeElement).toBe(lastCardCtrl.nativeElement);
  }));
  it('should not set focus to the new index card addVocab is called and false is passed', fakeAsync(() => {
    component.addVocab(false);
    fixture.detectChanges();
    tick();
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl).toBeNull();
  }));

  /**
   * New button related tests
   */
  it('should have a new vocab button on the HTML', () => {
    const el = fixture.debugElement.query(By.css('.new-btn'));
    expect(el).toBeTruthy();
    expect(el.nativeElement).toHaveClass('round-btn');
    expect(el.nativeElement).toHaveClass('main-btn');
    expect(el.nativeElement.getAttribute('aria-label')).toContain('new vocab');
  });
  it('should call the addVocab function on new vocab button click', () => {
    const fnc = spyOn(component, 'addVocab').and.callThrough();
    const vocabArray = component.form.get('vocabs') as FormArray;
    vocabArray.clear();
    fixture.detectChanges();
    expect(vocabArray.length).toBe(0);
    const newBtnEl = fixture.debugElement.query(By.css('.new-btn'));
    newBtnEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
    expect(vocabArray.length).toBe(1);
  });

  /**
   * Index card related tests
   */
  it('should have index card on the HTML', () => {
    const indexCards = fixture.debugElement.query(By.css('app-index-card'));
    expect(indexCards).toBeTruthy()
  });
  it('should pass vocabs form array and mode to IndexCardComponent', () => {
    component.mode = 'create';
    const vocabArray = component.form.get('vocabs') as FormArray;
    const indexCardComponent = fixture.debugElement.query(By.css('app-index-card')).componentInstance as IndexCardComponent;
    vocabArray.reset();
    vocabArray.push(new FormGroup({}));
    vocabArray.push(new FormGroup({}));
    fixture.detectChanges();
    expect(indexCardComponent.vocabs.length).toEqual(vocabArray.length);
    expect(indexCardComponent.mode).toEqual(component.mode);
  });
});

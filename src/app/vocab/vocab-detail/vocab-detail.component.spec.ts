import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../share/material.module';
import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { VocabDetailComponent } from './vocab-detail.component';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { IndexCardComponent } from './index-card/index-card.component';
import { VocabService } from './../vocab.service';
import { HttpClientModule } from '@angular/common/http';
import * as moment from 'moment';

const dummyVocabData = {
  id: 1,
  title: 'Test vocab title',
  publishedDate: '2020/06/13',
  likes: 103,
  saves: 50,
  author: {
    name: 'Bill Chen',
    username: 'billchen',
    // tslint:disable-next-line: max-line-length
    profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60'
  },
  vocabs: [
    {
      vocab: 'micronda',
      desc: 'noun. microwave'
    },
    {
      vocab: 'televición',
      desc: 'noun. television'
    },
    {
      vocab: 'ordenador',
      desc: 'noun. computer'
    },
    {
      vocab: 'patalla',
      desc: 'noun. monitor'
    }
  ]
};

@Component({
  selector: 'app-breadcrumb',
  template: ''
})
export class MockBreadcrumbComponent {}

class MockActivatedRoute {
  data = of({
    mode: 'create'
  });
  paramMap = of({
    get: () => {}
  });
}

class MockVocabService {
  getVocabPack(id): Observable<object> {
    return of({ data: dummyVocabData });
  }
  postVocab(body): Observable<object> {
    return of({});
  }
  patchVocab(body): Observable<object> {
    return of({});
  }
}

@Component({
  selector: 'app-index-card',
  template: `
    <div class="card-wrapper">
      <div class="card--front">
        <input class="ctrl vocab">
      </div>
      <div class="card--back">
        <textarea class="desc"></textarea>
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
  let mockHttp: HttpTestingController;
  let mockVocabService;

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
        HttpClientModule,
        HttpClientTestingModule,
        FontAwesomeModule,
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
        },
        {
          provide: VocabService,
          useClass: MockVocabService
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
    mockVocabService = TestBed.inject(VocabService);
    mockHttp = TestBed.inject(HttpTestingController);
    (component.form.get('vocabs') as FormArray).clear();
    // Set default mode to create
    component.mode = 'create';
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
    fixture.detectChanges();
    component.setMode();
    flush();
    const titleEl = fixture.debugElement.query(By.css('.ctrl-wrapper.--title .ctrl'));
    expect(document.activeElement).toBe(titleEl.nativeElement);
  }));

  /**
   * getVocab function related tests
   */
  it('should define getVocab function', () => {
    expect(component.getVocab).toBeDefined();
  });
  it('should call getVocabPack service when getVocab is called', fakeAsync(() => {
    const api = spyOn(mockVocabService, 'getVocabPack').and.returnValue(of({ data: {} }));
    const dummyId = 1;
    mockActivatedRoute.paramMap = of({ get: () => dummyId });
    component.getVocab(dummyId);
    fixture.detectChanges();
    expect(api).toHaveBeenCalledWith(dummyId);
  }));
  it('should call resetForm and clear vocabs array when getVocab is called', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.setMode();
    fixture.detectChanges();
    const fnc = spyOn(component, 'resetForm');
    component.addVocab();
    fixture.detectChanges();
    component.getVocab(1);
    tick();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
    expect((component.form.get('vocabs') as FormArray).length).toEqual(dummyVocabData.vocabs.length);
  }));
  it('should set form data after getVocab is called', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.setMode();
    const form = component.form;
    form.reset();
    fixture.detectChanges();
    component.getVocab(1);
    tick();
    fixture.detectChanges();
    expect(form.get('title').value).toEqual(dummyVocabData.title);
    expect((form.get('vocabs') as FormArray).length).toEqual(dummyVocabData.vocabs.length);
    expect(form.get('publishedDate').value).toEqual(dummyVocabData.publishedDate);
    const formattedDate = moment(new Date(dummyVocabData.publishedDate)).format('MMM DD, YYYY');
    expect(form.get('_publishedDate').value).toEqual(formattedDate);
    expect(form.get('likes').value).toEqual(dummyVocabData.likes);
    expect(form.get('saves').value).toEqual(dummyVocabData.saves);
    expect((form.get('author') as FormGroup).get('name').value).toEqual(dummyVocabData.author.name);
    expect((form.get('author') as FormGroup).get('username').value).toEqual(dummyVocabData.author.username);
    expect((form.get('author') as FormGroup).get('profilePic').value).toEqual(dummyVocabData.author.profilePic);
  }));


  /**
   * View mode related tests
   */
  it('should set mode to view mode when the url has the view keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    fixture.detectChanges();
    // View mode test
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('view');
  }));
  it('should call getVocab function in view mode', fakeAsync(() => {
    const fnc = spyOn(component, 'getVocab').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    tick();
    expect(fnc).toHaveBeenCalled();
  }));
  it('should store vocab id in view mode', () => {
    expect(component.vocabId).toBeNull();
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    expect(component.vocabId).toEqual(1);
  });
  it('should disable form in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.disabled).toBeTruthy();
  });
  it('should not show action buttons in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    fixture.detectChanges();
    const actionBtns = fixture.debugElement.query(By.css('.action-btns'));
    expect(actionBtns).toBeFalsy();
  });
  it('should not show title FormControl in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    fixture.detectChanges();
    const ctrl = fixture.debugElement.query(By.css('.title-ctrl'));
    expect(ctrl).toBeFalsy();
  });

  /**
   * Update mode related test
   */
  it('should mode to update mode when the url has the update mode keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/update/1');
    component.ngOnInit();
    fixture.detectChanges();
    // Update mode test
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('update');
  }));
  it('should call getVocab function in update mode', fakeAsync(() => {
    const fnc = spyOn(component, 'getVocab').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/update/1');
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(fnc).toHaveBeenCalled();
  }));
  it('should store vocab id in update mode', () => {
    expect(component.vocabId).toBeNull();
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/update/1');
    component.ngOnInit();
    expect(component.vocabId).toEqual(1);
  });

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
  it('should invoke the onSubmit function on save button click', () => {
    const fnc = spyOn(component, 'onSubmit').and.callFake(() => {});
    const btnEl = fixture.debugElement.query(By.css('.save-btn'));
    btnEl.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
  });
  it('should invoke the onCancel function on cancel button click', () => {
    expect(component.onCancel).toBeDefined();
    const fnc = spyOn(component, 'onCancel').and.callFake(() => {});
    const btnEl = fixture.debugElement.query(By.css('.cancel-btn'));
    btnEl.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
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
  it('should fill in page title in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    router.navigateByUrl('vocab/view/1');
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual(dummyVocabData.title);
  });
  it('should not have page title in update mode', () => {
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(titleEl).toBeFalsy();
  });

  /**
   * Detail section related tests
   */
  it('should have detail section in view and update mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const detailSecInView = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailSecInView).toBeTruthy();

    mockActivatedRoute.data = of({ mode: 'update' });
    component.setMode();
    fixture.detectChanges();
    const detailInUpdate = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailInUpdate).toBeTruthy();

    mockActivatedRoute.data = of({ mode: 'create' });
    component.setMode();
    fixture.detectChanges();
    const detailInCreate = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailInCreate).toBeFalsy();
  });
  it('should have author profile link', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('.author-link'));
    expect(link).toBeTruthy();
    const icon = fixture.debugElement.query(By.css('.author-link .avatar'));
    expect(icon).toBeTruthy();
    const name = fixture.debugElement.query(By.css('.author-link .name'));
    expect(name).toBeTruthy();
  });
  it('should have like button', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const likeBtn = fixture.debugElement.query(By.css('.--like-btn'));
    expect(likeBtn).toBeTruthy();
  });
  it('should have save button', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const saveBtn = fixture.debugElement.query(By.css('.--save-btn'));
    expect(saveBtn).toBeTruthy();
  });
  it('should have date', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const date = fixture.debugElement.query(By.css('.date'));
    expect(date).toBeTruthy();
  });
  it('should call onLike function when like button is clicked', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const fnc = spyOn(component, 'onLike').and.callFake(() => {});
    const btn = fixture.debugElement.query(By.css('.--like-btn'));
    btn.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
  });
  it('should call onSave function when save button is clicked', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const fnc = spyOn(component, 'onSave').and.callFake(() => {});
    const btn = fixture.debugElement.query(By.css('.--save-btn'));
    btn.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
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
    const ctrl = component.form.get('title');
    expect(ctrl).toBeTruthy();
    expect(ctrl).toBeInstanceOf(FormControl);
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
  it('should define a FormControl called publishedDate', () => {
    const ctrl = component.form.get('publishedDate');
    expect(ctrl).toBeTruthy();
    expect(ctrl).toBeInstanceOf(FormControl);
  });
  it('should define a FormControl called _publishedDate', () => {
    const ctrl = component.form.get('_publishedDate');
    expect(ctrl).toBeTruthy();
    expect(ctrl).toBeInstanceOf(FormControl);
  });
  it('should define a FormControl called likes', () => {
    const ctrl = component.form.get('likes');
    expect(ctrl).toBeTruthy();
    expect(ctrl).toBeInstanceOf(FormControl);
  });
  it('should define a FormControl called saves', () => {
    const ctrl = component.form.get('saves');
    expect(ctrl).toBeTruthy();
    expect(ctrl).toBeInstanceOf(FormControl);
  });
  it('should define a FormGroup called author', () => {
    const group = component.form.get('author');
    expect(group).toBeTruthy();
    expect(group).toBeInstanceOf(FormGroup);
    const nameCtrl = (group as FormGroup).get('name');
    const usernameCtrl = (group as FormGroup).get('username');
    const picCtrl = (group as FormGroup).get('profilePic');
    expect(nameCtrl).toBeTruthy();
    expect(nameCtrl).toBeInstanceOf(FormControl);
    expect(usernameCtrl).toBeTruthy();
    expect(usernameCtrl).toBeInstanceOf(FormControl);
    expect(picCtrl).toBeTruthy();
    expect(picCtrl).toBeInstanceOf(FormControl);
  });
  it('should initialize 1 item in vocabs formarray in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    const vocabArray = component.form.get('vocabs') as FormArray;
    vocabArray.clear();
    component.ngOnInit();
    fixture.detectChanges();
    expect(vocabArray.length).toBe(1);
  });
  it('should bind onSubmit function to form', () => {
    // should define onSubmit
    expect(component.onSubmit).toBeDefined();
    const form = fixture.debugElement.query(By.css('form'));
    const fnc = spyOn(component, 'onSubmit').and.callFake(() => {});
    form.triggerEventHandler('submit', null);
    expect(fnc).toHaveBeenCalled();
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
    component.mode = 'create';
    component.addVocab();
    fixture.detectChanges();
    tick();
    const lastCard = fixture.debugElement.query(By.css('.card-wrapper:last-child .card--front .ctrl'));
    expect(document.activeElement).toBe(lastCard.nativeElement);
  }));
  it('should not set focus to the new index card addVocab is called and false is passed', fakeAsync(() => {
    component.mode = 'create';
    component.addVocab(false);
    fixture.detectChanges();
    tick();
    const focusedEl = fixture.debugElement.query(By.css(':focus'));
    expect(focusedEl).toBeNull();
  }));
  it('should add vocab to form array and set data if data is passed', () => {
    const dummyVocab = {
      vocab: 'test',
      desc: 'test desc'
    };
    const vocabArray = component.form.get('vocabs') as FormArray;
    vocabArray.clear();
    component.addVocab(false, dummyVocab);
    fixture.detectChanges();
    expect(vocabArray.length).toBe(1);
    const firstItem = vocabArray.at(0) as FormGroup;
    expect(firstItem.get('vocab').value).toEqual(dummyVocab.vocab);
    expect(firstItem.get('desc').value).toEqual(dummyVocab.desc);
  });

  /**
   * Presentation mode related tests
   */
  it('should have mode toggle button in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(btn).toBeTruthy();
  });
  it('should set aria-label on mode toggle button', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(btn.nativeElement.getAttribute('aria-label')).toContain('Presentation Mode');
  });
  it('should define current mode in a variable called presentationMode', () => {
    expect(component.presentationMode).toBeDefined();
    expect(component.presentationMode).toBeFalsy();
  });
  it('should show correct text on mode button depending on presentationMode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    component.presentationMode = false;
    fixture.detectChanges();
    const oldBtn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(oldBtn.nativeElement.innerText).toEqual('Presentation Mode');

    component.presentationMode = true;
    fixture.detectChanges();
    const newBtn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(newBtn.nativeElement.innerText).toEqual('Show All');
  });
  it('should have correct aria-label on mode button depending on presentationMode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    component.presentationMode = false;
    fixture.detectChanges();
    const oldBtn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(oldBtn.nativeElement.getAttribute('aria-label')).toEqual('Presentation Mode');

    component.presentationMode = true;
    fixture.detectChanges();
    const newBtn = fixture.debugElement.query(By.css('.mode-btn'));
    expect(newBtn.nativeElement.getAttribute('aria-label')).toEqual('Show All');
  });
  it('should toggle presetation mode on mode button click', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    component.presentationMode = false;
    fixture.detectChanges();
    const modeBtn = fixture.debugElement.query(By.css('.mode-btn'));
    modeBtn.triggerEventHandler('click', () => {});
    fixture.detectChanges();
    expect(component.presentationMode).toBeTruthy();
  });

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
  it('should not show new vocab button in view mode', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.setMode();
    tick();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.new-btn'));
    expect(el).toBeFalsy();
  }));

  /**
   * Index card integration related tests
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

  /**
   * Validation tests
   */
  it('should validate form title', () => {
    expect(component.isFormValid).toBeDefined();
    const form = component.form;
    const titleCtrl = form.get('title');
    titleCtrl.setValue('');
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalsy();

    const vocabsArray = component.form.get('vocabs') as FormArray;
    vocabsArray.controls.forEach(item => {
      item.get('vocab').setValue('123');
      item.get('desc').setValue('123');
    });
    titleCtrl.setValue('123');
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTruthy();
  });
  it('should validate empty vocabs formarray', () => {
    const form = component.form;
    const vocabsArray = form.get('vocabs') as FormArray;
    vocabsArray.clear();
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalsy();
  });
  it('should validate at least one valid item in vocabs formarray', () => {
    const vocabsArray = component.form.get('vocabs') as FormArray;
    vocabsArray.push(new FormGroup({
      vocab: new FormControl(''),
      desc: new FormControl('')
    }));
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalsy();

    const titleCtrl = component.form.get('title');
    titleCtrl.setValue('title');
    vocabsArray.controls.forEach(item => {
      item.get('vocab').setValue('123');
      item.get('desc').setValue('123');
    });
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTruthy();
  });
  it('should mark form as touched when call isFormValid', () => {
    const markAllAsTouched = spyOn(component.form, 'markAllAsTouched');
    component.isFormValid();
    expect(markAllAsTouched).toHaveBeenCalled();
  });
  it('should return false when there are invalid controls', () => {
    const form = component.form;
    form.get('title').setValue('123');
    const vocabsArray = form.get('vocabs') as FormArray;
    vocabsArray.push(new FormGroup({
      vocab: new FormControl('123'),
      desc: new FormControl('123')
    }));
    vocabsArray.push(new FormGroup({
      vocab: new FormControl(null),
      desc: new FormControl(null)
    }));
    expect(component.isFormValid()).toBeFalsy();
  });
  it('should return true when form is valid', () => {
    const form = component.form;
    form.get('title').setValue('123');
    const vocabsArray = form.get('vocabs') as FormArray;
    vocabsArray.controls.forEach(item => {
      item.get('vocab').setValue('123');
      item.get('desc').setValue('123');
    });
    expect(component.isFormValid()).toBeTruthy();
  });

  /**
   * onSubmit related tests
   */
  it('should invoke isFormValid when onSubmit is called', () => {
    const fnc = spyOn(component, 'isFormValid').and.returnValue(true);
    component.onSubmit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should not call postVocab api if isFormValid returns false', () => {
    component.mode = 'create';
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(false);
    expect(component.vocabService).toBeDefined();
    const fnc = spyOn(mockVocabService, 'postVocab');
    component.onSubmit();
    expect(fnc).not.toHaveBeenCalled();
  });
  it('should not call patchVocab api if isFormValid returns false', () => {
    component.mode = 'update';
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(false);
    expect(component.vocabService).toBeDefined();
    const fnc = spyOn(mockVocabService, 'patchVocab');
    component.onSubmit();
    expect(fnc).not.toHaveBeenCalled();
  });
  it('should call postVocab api in create mode if isFormValid returns true', () => {
    component.mode = 'create';
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(true);
    const postFnc = spyOn(mockVocabService, 'postVocab').and.returnValue(of({}));
    const patchFnc = spyOn(mockVocabService, 'patchVocab').and.returnValue(of({}));
    component.onSubmit();
    expect(postFnc).toHaveBeenCalled();
    expect(patchFnc).not.toHaveBeenCalled();
  });
  it('should call patchVocab api in update mode if isFormValid returns true', () => {
    component.mode = 'update';
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(true);
    const postFnc = spyOn(mockVocabService, 'postVocab').and.returnValue(of({}));
    const patchFnc = spyOn(mockVocabService, 'patchVocab').and.returnValue(of({}));
    component.onSubmit();
    expect(patchFnc).toHaveBeenCalled();
    expect(postFnc).not.toHaveBeenCalled();
  });
  it('should verify at least one index card onSubmit', () => {});
});

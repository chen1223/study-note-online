import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';

import { NoteDetailComponent } from './note-detail.component';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../share/material.module';
import { ShareModule } from '../../share/share.module';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NoteService } from './../note.service';
import * as moment from 'moment';

const dummyNote = {
  id: 1,
  publishedDate: '2020/06/13',
  likes: 103,
  saves: 50,
  author: {
    name: 'Bill Chen',
    username: 'billchen',
    profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60'
  },
  title: 'test note',
  note: '<p>asdf <strong>zxcv</strong> <span style="color: rgb(73, 201, 221);">asdfasdfasdf</span></p>'
};

class MockActivatedRoute {
  data = of({
    mode: 'create'
  });
  paramMap = of({ get: () => 1 });
}

class MockNoteService {
  getNote() {
    return of({
      data: dummyNote
    });
  }
  postNote(body) {
    return of({});
  }
  patchNote(body) {
    return of({});
  }
}

describe('NoteDetailComponent', () => {
  let component: NoteDetailComponent;
  let fixture: ComponentFixture<NoteDetailComponent>;
  let router: Router;
  let mockActivatedRoute;
  let mockNoteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDetailComponent ],
      imports: [
        MaterialModule,
        ShareModule,
        FormsModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'note/new',
            component: NoteDetailComponent,
            data: {
              mode: 'create'
            }
          },
          {
            path: 'note/view/:id',
            component: NoteDetailComponent,
            data: {
              mode: 'view'
            }
          },
          {
            path: 'note/update/:id',
            component: NoteDetailComponent,
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
          provide: NoteService,
          useClass: MockNoteService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    mockNoteService = TestBed.inject(NoteService);
    // Set default mode to view mode
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
    router.navigateByUrl('note/new');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('create');
  }));
  it('should set focus on the title input in create mode', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'create' });
    fixture.detectChanges();
    component.setMode();
    flush();
    const titleEl = fixture.debugElement.query(By.css('.ctrl-wrapper.--title .ctrl'));
    expect(document.activeElement).toBe(titleEl.nativeElement);
  }));
  it('should show quill-editor in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-editor');
    expect(el).toBeTruthy();
  });
  it('should not show quill-view-html in create mode', () => {
    component.mode = 'create';
    fixture.detectChanges();
    const el = document.querySelector('quill-view-html');
    expect(el).toBeFalsy();
  });
  it('should not show page title in update mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.page-title'));
    expect(el).toBeTruthy();
  });

  /**
   * View mode related tests
   */
  it('should set mode to view mode when the url has the view keyword', fakeAsync(() => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    fixture.detectChanges();
    // View mode test
    router.navigateByUrl('note/view/1');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('view');
  }));
  it('should call getData function in view mode', () => {
    const fnc = spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should store noteId in view mode', () => {
    expect(component.noteId).toBeNull();
    const mockNoteId = 1;
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => mockNoteId });
    router.navigateByUrl(`/note/view/${mockNoteId}`);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.noteId).toEqual(mockNoteId);
  });
  it('should disable form in view mode', fakeAsync(() => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.form.disabled).toBeTruthy();
  }));
  it('should not show quill-editor in view mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-editor');
    expect(el).toBeFalsy();
  });
  it('should show quill-view-html in view mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-view-html');
    expect(el).toBeTruthy();
  });
  it('should bind --view-mode class to action-row in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-row'));
    expect(el.nativeElement.classList).toContain('--view-mode');
  });
  it('should show page title in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.page-title'));
    expect(el).toBeTruthy();
  });
  it('should not show action-btns in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-btns'));
    expect(el).toBeFalsy();
  });
  it('should not show title control in view mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.ctrl-title'));
    expect(el).toBeFalsy();
  });

  /**
   * Update mode related test
   */
  it('should set mode to update mode when the url has the upate mode keyword', fakeAsync(() => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    fixture.detectChanges();
    // Update mode test
    router.navigateByUrl('note/update/1');
    tick();
    fixture.detectChanges();
    expect(component.mode).toEqual('update');
  }));
  it('should call getData function in update mode', () => {
    const fnc = spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should store noteId in update mode', () => {
    expect(component.noteId).toBeNull();
    const mockNoteId = 1;
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => mockNoteId });
    router.navigateByUrl(`note/update/${mockNoteId}`);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.noteId).toEqual(mockNoteId);
  });
  it('should show quill-editor in update mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-editor');
    expect(el).toBeTruthy();
  });
  it('should not show quill-view-html in update mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-view-html');
    expect(el).toBeFalsy();
  });
  it('should not have --view-mode class to action-row in update mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-row'));
    expect(el.nativeElement.classList).not.toContain('--view-mode');
  });
  it('should not show page title in update mode', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.page-title'));
    expect(el).toBeFalsy();
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
  it('should not have --view-mode class to action-row in update mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.action-row'));
    expect(el.nativeElement.classList).not.toContain('--view-mode');
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
  it('should call isFormValid when onSubmit function is called', () => {
    const fnc = spyOn(component, 'isFormValid');
    component.onSubmit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should get formRawValue when onSubmit is called', () => {
    spyOn(component, 'isFormValid').and.returnValue(true);
    const fnc = spyOn(component.form, 'getRawValue');
    component.onSubmit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  });
  it('should call postNote in create mode when onSubmit is called', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(true);
    const fnc = spyOn(mockNoteService, 'postNote').and.returnValue(of({}));
    component.onSubmit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should call patchNote in update mode when onSubmit is called', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    spyOn(component, 'isFormValid').and.returnValue(true);
    const fnc = spyOn(mockNoteService, 'patchNote').and.returnValue(of({}));
    component.onSubmit();
    expect(fnc).toHaveBeenCalled();
  });

  /**
   * Page title related tests
   */
  it('should have page title: New Note in create mode', () => {
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('New Note');
    expect(component.title).toEqual('New Note');
  });
  it('should set page title according to data', fakeAsync(() => {
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual(dummyNote.title);
  }));

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
  it('should define a FormControl called note with required validation', () => {
    expect(component.form.get('note')).toBeTruthy();
    expect(component.form.get('note')).toBeInstanceOf(FormControl);

    // Validation test
    component.form.get('note').setValue(null);
    fixture.detectChanges();
    expect(component.form.get('note').invalid).toBeTruthy();
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
  it('should bind onSubmit function to form', () => {
    // should define onSubmit
    expect(component.onSubmit).toBeDefined();
    const form = fixture.debugElement.query(By.css('form'));
    const fnc = spyOn(component, 'onSubmit').and.callFake(() => {});
    form.triggerEventHandler('submit', null);
    expect(fnc).toHaveBeenCalled();
  });
  it('should define isFormValid', () => {
    expect(component.isFormValid);
  });
  it('should return false when title is empty', () => {
    const form = component.form;
    form.get('note').setValue('123');
    form.get('title').setValue(null);
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalsy();
  });
  it('should return false when note is empty', () => {
    const form = component.form;
    form.get('title').setValue('123');
    form.get('note').setValue(null);
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalsy();
  });
  it('should return true when both title and note are valid', () => {
    const form = component.form;
    form.get('title').setValue('123');
    form.get('note').setValue('123');
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTruthy();
  });

  /**
   * Editable section related tests
   */
  it('should define toolbarConfig', () => {
    expect(component.toolbarConfig).toBeTruthy();
  });
  it('should not call QuillEditor toolbar after view init in view mode', () => {
    expect(component.setQuillEditor).toBeTruthy();
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'view' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    const fnc = spyOn(component, 'setQuillEditor');
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(fnc).not.toHaveBeenCalled();
  });

  it('should set QuillEditor toolbar after view init in update mode', () => {
    expect(component.setQuillEditor).toBeTruthy();
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'update' });
    mockActivatedRoute.paramMap = of({ get: () => 1 });
    component.ngOnInit();
    const fnc = spyOn(component, 'setQuillEditor');
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
    expect(component.quillEditor.modules.toolbar).toBe(component.toolbarConfig);
  });
  it('should set QuillEditor toolbar after view init in create mode', () => {
    expect(component.setQuillEditor).toBeTruthy();
    spyOn(component, 'getData').and.callFake(() => {});
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    const fnc = spyOn(component, 'setQuillEditor');
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
    expect(component.quillEditor.modules.toolbar).toBe(component.toolbarConfig);
  });

  /**
   * getData function related tests
   */
  it('should have a function called getData', () => {
    expect(component.getData).toBeDefined();
  });
  it('should invoke getNote of NoteService on getData called', () => {
    expect(component.noteService).toBeDefined();
    const fnc = spyOn(mockNoteService, 'getNote').and.callThrough();
    component.getData(1);
    expect(fnc).toHaveBeenCalled();
  });
  it('should update form after getNote is called', fakeAsync(() => {
    component.mode = 'update';
    component.form.reset();
    fixture.detectChanges();
    component.getData(1);
    tick();
    fixture.detectChanges();
    const form = component.form;
    expect(component.form.get('title').value).toEqual(dummyNote.title);
    expect(component.form.get('note').value).toEqual(dummyNote.note);
    expect(form.get('publishedDate').value).toEqual(dummyNote.publishedDate);
    const formattedDate = moment(new Date(dummyNote.publishedDate)).format('MMM DD, YYYY');
    expect(form.get('_publishedDate').value).toEqual(formattedDate);
    expect(form.get('likes').value).toEqual(dummyNote.likes);
    expect(form.get('saves').value).toEqual(dummyNote.saves);
    expect((form.get('author') as FormGroup).get('name').value).toEqual(dummyNote.author.name);
    expect((form.get('author') as FormGroup).get('username').value).toEqual(dummyNote.author.username);
    expect((form.get('author') as FormGroup).get('profilePic').value).toEqual(dummyNote.author.profilePic);
  }));

  /**
   * Detail section related tests
   */
  it('should only show detail section in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.setMode();
    fixture.detectChanges();
    const detailSecInView = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailSecInView).toBeTruthy();

    mockActivatedRoute.data = of({ mode: 'update' });
    component.setMode();
    fixture.detectChanges();
    const detailInUpdate = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailInUpdate).toBeFalsy();

    mockActivatedRoute.data = of({ mode: 'create' });
    component.setMode();
    fixture.detectChanges();
    const detailInCreate = fixture.debugElement.query(By.css('.detail-section'));
    expect(detailInCreate).toBeFalsy();
  });
  it('should have author profile link in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('.author-link'));
    expect(link).toBeTruthy();
    const icon = fixture.debugElement.query(By.css('.author-link .avatar'));
    expect(icon).toBeTruthy();
    const name = fixture.debugElement.query(By.css('.author-link .name'));
    expect(name).toBeTruthy();
  });
  it('should have like button in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const likeBtn = fixture.debugElement.query(By.css('.--like-btn'));
    expect(likeBtn).toBeTruthy();
  });
  it('should have social save button in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const saveBtn = fixture.debugElement.query(By.css('.--save-btn'));
    expect(saveBtn).toBeTruthy();
  });
  it('should have date in view mode', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const date = fixture.debugElement.query(By.css('.date'));
    expect(date).toBeTruthy();
  });
  it('should call onLike function when like button is clicked', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const fnc = spyOn(component, 'onLike').and.callFake(() => {});
    const btn = fixture.debugElement.query(By.css('.--like-btn'));
    btn.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
  });
  it('should call onSave function when save button is clicked', () => {
    component.mode = 'view';
    fixture.detectChanges();
    const fnc = spyOn(component, 'onSave').and.callFake(() => {});
    const btn = fixture.debugElement.query(By.css('.--save-btn'));
    btn.triggerEventHandler('click', null);
    expect(fnc).toHaveBeenCalled();
  });
});

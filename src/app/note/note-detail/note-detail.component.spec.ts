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
}

class MockNoteService {
  getNote() {
    return of({
      data: dummyNote
    });
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
    mockActivatedRoute.data = of({ mode: 'create' });
    component.ngOnInit();
    fixture.detectChanges();
    const el = document.querySelector('quill-view-html');
    expect(el).toBeFalsy();
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
  it('should have page title: View Note in view mode', () => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('View Note');
    expect(component.title).toEqual('View Note');
  });
  it('should have page title: Update Note in update mode', () => {
    mockActivatedRoute.data = of({ mode: 'update' });
    component.ngOnInit();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.page-title'));
    expect(component.title).toBeDefined();
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerText).toEqual('Update Note');
    expect(component.title).toEqual('Update Note');
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
  it('should define a FormControl called note', () => {
    expect(component.form.get('note')).toBeTruthy();
    expect(component.form.get('note')).toBeInstanceOf(FormControl);
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
    component.form.reset();
    fixture.detectChanges();
    component.getData(1);
    tick();
    fixture.detectChanges();
    expect(component.form.get('title').value).toEqual(dummyNote.title);
    expect(component.form.get('note').value).toEqual(dummyNote.note);
  }));
});

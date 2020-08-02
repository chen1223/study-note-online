import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';

import { NoteDetailComponent } from './note-detail.component';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../share/material.module';
import { ShareModule } from '../../share/share.module';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

class MockActivatedRoute {
  data = of({
    mode: 'create'
  });
}

describe('NoteDetailComponent', () => {
  let component: NoteDetailComponent;
  let fixture: ComponentFixture<NoteDetailComponent>;
  let router: Router;
  let mockActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDetailComponent ],
      imports: [
        MaterialModule,
        ShareModule,
        FormsModule,
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

  /**
   * View mode related tests
   */
  it('should set mode to view mode when the url has the view keyword', fakeAsync(() => {
    mockActivatedRoute.data = of({ mode: 'view' });
    component.ngOnInit();
    fixture.detectChanges();
    // View mode test
    router.navigateByUrl('note/view/1');
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
    router.navigateByUrl('note/update/1');
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
  it('should set QuillEditor toolbar after view init', () => {
    expect(component.setQuillEditor).toBeTruthy();
    const fnc = spyOn(component, 'setQuillEditor');
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
    expect(component.quillEditor.modules.toolbar).toBe(component.toolbarConfig);
  });
});

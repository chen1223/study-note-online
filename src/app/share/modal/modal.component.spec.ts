import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define swalPortalTarget', () => {
    expect(component.swalTarget).toBeTruthy();
    expect(component.swalTarget).toBeInstanceOf(SwalPortalTargets);
  });

  it('should define swal tag in the HTML', () => {
    const el = fixture.debugElement.query(By.css('swal'));
    expect(el).toBeTruthy();
  },);
});

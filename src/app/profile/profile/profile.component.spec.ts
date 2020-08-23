import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '../profile.service';

const dummyProfile = {
  id: 1,
  name: 'Bill Chen',
  username: 'billchen',
  profilePic: 'https://images.unsplash.com/photo-1522039553440-46d3e1e61e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60',
  followers: 13,
  followings: 12,
  totalVocabs: 10,
  totalNotes: 10,
  totalBooks: 10,
  vocabs: [
    {
      id: 1,
      title: 'Fruta'
    },
    {
      id: 2,
      title: 'Technología'
    },
    {
      id: 3,
      title: 'Comida'
    },
    {
      id: 4,
      title: 'Edificío'
    }
  ],
  notes: [
    {
      id: 1,
      title: '123'
    },
    {
      id: 2,
      title: '234'
    },
    {
      id: 3,
      title: '345'
    },
    {
      id: 4,
      title: 'asd'
    }
  ],
  books: [
    {
      id: 1,
      title: 'Book1'
    },
    {
      id: 2,
      title: 'Book2'
    },
    {
      id: 3,
      title: 'Book3'
    },
    {
      id: 4,
      title: 'Book4'
    }
  ]
};

class MockActivatedRoute {
  paramMap = of({
    get: () => {}
  });
}

class MockProfileService {
  getProfile(id) {
    return of({ data: dummyProfile });
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockActivatedRoute;
  let mockProfileService: ProfileService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: ':id',
            component: ProfileComponent
          }
        ])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: ProfileService,
          useClass: MockProfileService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute);
    mockProfileService = TestBed.inject(ProfileService);
    mockActivatedRoute.paramMap = of({ get: () => 'dummyId' });
    fixture.detectChanges();
  });

  /**
   * ngOnInit related tests
   */
  it('should get profile id from activatedRoute in ngOnInit', () => {
    const dummyId = 'dummmyId';
    expect(component.profileId).toBeDefined();
    mockActivatedRoute.paramMap = of({ get: () => dummyId });
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.profileId).toEqual(dummyId);
  });
  it('should define function getData', () => {
    expect(component.getData).toBeTruthy();
  });
  it('should call getData in ngOnInit', () => {
    const dummyId = 'dummyId';
    expect(component.profileData).toBeDefined();
    mockActivatedRoute.paramMap = of({ get: () => dummyId });
    const fnc = spyOn(component, 'getData');
    component.ngOnInit();
    expect(fnc).toHaveBeenCalled();
  });
  it('should call getProfile of ProfileService when getData is called', fakeAsync(() => {
    const fnc = spyOn(component.profileService, 'getProfile').and.returnValue(of({ data: dummyProfile }));
    expect(component.profileId).toBeDefined();
    const dummyId = 'dummyId';
    component.profileId = dummyId;
    fixture.detectChanges();
    component.getData();
    expect(fnc).toHaveBeenCalledWith(dummyId);
    tick();
    fixture.detectChanges();
    expect(component.profileData).toBe(dummyProfile);
  }));
});

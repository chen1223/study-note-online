import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '../profile.service';
import { By } from '@angular/platform-browser';
import { ShareModule } from '../../share/share.module';

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
  snapshot = {};
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
        ShareModule,
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

  /**
   * Back link related tests
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
   * Basic info section related tests
   */
  it('should have basic info section', () => {
    const el = fixture.debugElement.query(By.css('.basic-info'));
    expect(el).toBeTruthy();
  });
  it('should have profile wrapper', () => {
    const el = fixture.debugElement.query(By.css('.profile-wrapper'));
    expect(el).toBeTruthy();
  });
  it('should have follow wrapper', () => {
    const el = fixture.debugElement.query(By.css('.follow-wrapper'));
    expect(el).toBeTruthy();
  });
  it('should have follow button', () => {
    const el = fixture.debugElement.query(By.css('.follow-btn'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('aria-label')).toEqual('Follow');
    expect(el.nativeElement.innerText).toEqual('Follow');
  });
  it('should have profile image', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();
    const imgWrapperEl = fixture.debugElement.query(By.css('.profile-img-wrapper'));
    const el = fixture.debugElement.query(By.css('.profile-img')).nativeElement as HTMLImageElement;
    expect(imgWrapperEl).toBeTruthy();
    expect(el).toBeTruthy();
    expect(el.src).toEqual(dummyProfile.profilePic);
    expect(el.getAttribute('alt')).toEqual(dummyProfile.name);
  });
  it('should show profile name', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.profile__name'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.innerText).toEqual(dummyProfile.name);
  });
  it('should show followers and followings statistics', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();
    const followTitleEl = fixture.debugElement.query(By.css('.follow__title.--follower'));
    const followEl = fixture.debugElement.query(By.css('.follow__detail.--follower'));
    expect(followTitleEl).toBeTruthy();
    expect(followTitleEl.nativeElement.innerText).toEqual('Followers:');
    expect(followEl).toBeTruthy();
    expect(followEl.nativeElement.innerText).toEqual(dummyProfile.followers.toString());

    const followingTitleEl = fixture.debugElement.query(By.css('.follow__title.--following'));
    const followingEl = fixture.debugElement.query(By.css('.follow__detail.--following'));
    expect(followingTitleEl).toBeTruthy();
    expect(followingTitleEl.nativeElement.innerText).toEqual('Following:');
    expect(followingEl).toBeTruthy();
    expect(followingEl.nativeElement.innerText).toEqual(dummyProfile.followings.toString());
  });

  /**
   * Vocab section related tests
   */
  it('should have vocab section', () => {
    const el = fixture.debugElement.query(By.css('.vocab-section'));
    expect(el).toBeTruthy();
  });
  it('should have section title, counter, and see all in vocab section', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.section-title.--vocab'));
    const counter = fixture.debugElement.query(By.css('.counter.--vocab'));
    const seeAll = fixture.debugElement.query(By.css('.see-all.--vocab'));

    expect(title).toBeTruthy();
    expect(title.nativeElement.innerText).toEqual('Vocabularies');
    expect(counter).toBeTruthy();
    expect(counter.nativeElement.innerText).toEqual(`${dummyProfile.totalVocabs.toString()} packs`);
    expect(seeAll).toBeTruthy();
  });
  it('should only show vocab section if totalVocabs is greater than 0', () => {
    dummyProfile.totalVocabs = 0;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const vocabSection = fixture.debugElement.query(By.css('.vocab-section'));
    expect(vocabSection).toBeFalsy();

    // Test totalVocabs > 0
    dummyProfile.totalVocabs = 10;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const updatedVocabSection = fixture.debugElement.query(By.css('.vocab-section'));
    expect(updatedVocabSection).toBeTruthy();
  });

  /**
   * Note section related tests
   */
  it('should have note section', () => {
    const el = fixture.debugElement.query(By.css('.note-section'));
    expect(el).toBeTruthy();
  });
  it('should have section title, counter, and see all in note section', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.section-title.--note'));
    const counter = fixture.debugElement.query(By.css('.counter.--note'));
    const seeAll = fixture.debugElement.query(By.css('.see-all.--note'));

    expect(title).toBeTruthy();
    expect(title.nativeElement.innerText).toEqual('Notes');
    expect(counter).toBeTruthy();
    expect(counter.nativeElement.innerText).toEqual(`${dummyProfile.totalNotes.toString()} notes`);
    expect(seeAll).toBeTruthy();
  });
  it('should only show note section when totalNotes > 0', () => {
    dummyProfile.totalNotes = 0;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const noteSection = fixture.debugElement.query(By.css('.note-section'));
    expect(noteSection).toBeFalsy();

    // Test totalNotes > 0
    dummyProfile.totalNotes = 10;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const updatedNoteSection = fixture.debugElement.query(By.css('.note-section'));
    expect(updatedNoteSection).toBeTruthy();
  });

  /**
   * Book section related tests
   */
  it('should have book section', () => {
    const el = fixture.debugElement.query(By.css('.book-section'));
    expect(el).toBeTruthy();
  });
  it('should have section title, counter, and see all in book section', () => {
    component.profileData = dummyProfile;
    component.profileId = dummyProfile.username;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.section-title.--book'));
    const counter = fixture.debugElement.query(By.css('.counter.--book'));
    const seeAll = fixture.debugElement.query(By.css('.see-all.--book'));

    expect(title).toBeTruthy();
    expect(title.nativeElement.innerText).toEqual('Books');
    expect(counter).toBeTruthy();
    expect(counter.nativeElement.innerText).toEqual(`${dummyProfile.totalBooks.toString()} books`);
    expect(seeAll).toBeTruthy();
  });
  it('should only show book section when totalBooks > 0', () => {
    dummyProfile.totalBooks = 0;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const bookSection = fixture.debugElement.query(By.css('.book-section'));
    expect(bookSection).toBeFalsy();

    // Test totalBooks > 0
    dummyProfile.totalBooks = 10;
    component.profileData = dummyProfile;
    fixture.detectChanges();
    const updatedBookSection = fixture.debugElement.query(By.css('.book-section'));
    expect(updatedBookSection).toBeTruthy();
  });
});

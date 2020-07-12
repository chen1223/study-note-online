import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BreadcrumbComponent } from './breadcrumb.component';
import { By } from '@angular/platform-browser';
import { Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  const testData = [
    {
      text: 'home',
      link: '/'
    },
    {
      text: 'demo',
      link: '/demo'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbComponent ],
      imports: [RouterTestingModule.withRoutes([])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should contianer breadcrumb list with class called "breadcrumb-list" in the HTML', () => {
    const el = fixture.debugElement.query(By.css('.breadcrumb-list'));
    expect(el).toBeTruthy();
  });

  it('should define breadcrumb list input', () => {
    expect(component.breadcrumbList).toBeInstanceOf(Array);
    expect(component.breadcrumbList.length).toBe(0);
  });

  it('should render breadcrumb list in the HTML', () => {
    component.breadcrumbList = testData;
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('.breadcrumb'));
    expect(elements.length).toBe(testData.length);
  });

  it('should render text and link for each breadcrumb', fakeAsync(() => {
    component.breadcrumbList = testData;
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css('.breadcrumb'));
    elements.forEach((el, index) => {
      const link = el.query(By.css('a')).nativeElement;
      const data = testData[index];
      expect(link.innerText).toEqual(data.text);
      expect(link.getAttribute('aria-label')).toBe(data.text);
      expect(link.getAttribute('href')).toBe(data.link);
    });
  }));
});

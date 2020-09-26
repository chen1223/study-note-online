import { MatDialogModule } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-dialog',
  template: '',
  styles: []
})
export class MockLoadingDialogComponent {}

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockLoadingDialogComponent
      ],
      imports: [
        MatDialogModule
      ]
    });
    service = TestBed.inject(LoadingService);
  });

  /**
   * show related tests
   */
  it('should define a function called show', () => {
    expect(service.show).toBeTruthy();
  });
  it('should open dialog when show function is called', () => {
    const fnc = spyOn(service.dialog, 'open');
    service.show();
    expect(fnc).toHaveBeenCalled();
  });

  /**
   * hide related tests
   */
  it('should define a function called hide', () => {
    expect(service.hide).toBeDefined();
  });
  it('should closeAll dialog when hide function is called', () => {
    const fnc = spyOn(service.dialog, 'closeAll');
    service.hide();
    expect(fnc).toHaveBeenCalled();
  });
});

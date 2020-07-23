import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VocabService } from './vocab.service';
import { of } from 'rxjs';

describe('VocabService', () => {
  let service: VocabService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(VocabService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should have postVocab function', fakeAsync(() => {
    expect(service.postVocab).toBeDefined();
  }));

  it('should have patchVocab function', fakeAsync(() => {
    expect(service.patchVocab).toBeDefined();
  }));
});

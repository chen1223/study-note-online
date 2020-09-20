import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VocabService } from './vocab.service';
import { API } from '../share/api.model';

describe('VocabService', () => {
  let service: VocabService;
  let httpMock: HttpTestingController;

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

  /**
   * Get vocabs related tests
   */
  it('should have getVocabPack function', () => {
    expect(service.getVocabPack).toBeDefined();
  });
  it('should send GET request to VOCABS endpoint when getVocabPack is called', fakeAsync(() => {
    const url = API.VOCABS;
    const mockId = 1;
    service.getVocabPack(mockId).subscribe(res => {});
    const mockRequest = httpMock.expectOne(`${url}/${mockId}`);
    expect(mockRequest.request.method).toEqual('GET');
    httpMock.verify();
  }));

  /**
   * postVocab related tests
   */
  it('should have postVocab function', fakeAsync(() => {
    expect(service.postVocab).toBeDefined();
  }));
  it('should send POST request to VOCABS endpoint when postVocab is called', fakeAsync(() => {
    const url = API.VOCABS;
    const mockBody = {
      title: 'test123',
      vocabs: [
        {
          vocab: '123',
          desc: '123'
        }
      ]
    };
    service.postVocab(mockBody).subscribe(res => {});
    const mockRequest = httpMock.expectOne(url);
    expect(mockRequest.request.method).toEqual('POST');
    httpMock.verify();
  }));

  /**
   * patchVocab related tests
   */
  it('should have patchVocab function', fakeAsync(() => {
    expect(service.patchVocab).toBeDefined();
  }));
  it('should send PATCH request to VOCABS endpoint when patchVocab is called', fakeAsync(() => {
    const url = API.VOCABS;
    const mockId = 1;
    const mockBody = {
      title: 'test123',
      vocabs: [
        {
          id: 1,
          vocab: '123',
          desc: '123'
        }
      ]
    };
    service.patchVocab(mockId, mockBody).subscribe(res => {});
    const mockRequest = httpMock.expectOne(`${url}/${mockId}`);
    expect(mockRequest.request.method).toEqual('PATCH');
    expect(mockRequest.request.body).toEqual(mockBody);
    httpMock.verify();
  }));

});

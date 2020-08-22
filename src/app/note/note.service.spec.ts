import { TestBed } from '@angular/core/testing';

import { NoteService } from './note.service';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should define function getNote', () => {
    expect(service.getNote).toBeDefined();
  });

  it('should define function postNote', () => {
    expect(service.postNote).toBeDefined();
  });

  it('should define function patchNote', () => {
    expect(service.patchNote).toBeDefined();
  });
});

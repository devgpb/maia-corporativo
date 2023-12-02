import { TestBed } from '@angular/core/testing';

import { EventosServce } from './eventos.service';

describe('EventosServce', () => {
  let service: EventosServce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosServce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

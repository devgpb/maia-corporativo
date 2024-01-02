import { TestBed } from '@angular/core/testing';

import { AutomacoesService } from './automacoes.service';

describe('AutomacoesService', () => {
  let service: AutomacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

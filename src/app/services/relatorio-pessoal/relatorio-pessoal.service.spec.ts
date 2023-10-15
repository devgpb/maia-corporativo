import { TestBed } from '@angular/core/testing';

import { RelatorioPessoalService } from './relatorio-pessoal.service';

describe('RelatorioPessoalService', () => {
  let service: RelatorioPessoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatorioPessoalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

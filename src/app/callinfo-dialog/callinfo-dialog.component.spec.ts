import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallinfoDialogComponent } from './callinfo-dialog.component';

describe('CallinfoDialogComponent', () => {
  let component: CallinfoDialogComponent;
  let fixture: ComponentFixture<CallinfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallinfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallinfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

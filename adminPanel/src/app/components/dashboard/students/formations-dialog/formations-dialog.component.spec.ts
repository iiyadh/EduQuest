import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsDialogComponent } from './formations-dialog.component';

describe('FormationsDialogComponent', () => {
  let component: FormationsDialogComponent;
  let fixture: ComponentFixture<FormationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

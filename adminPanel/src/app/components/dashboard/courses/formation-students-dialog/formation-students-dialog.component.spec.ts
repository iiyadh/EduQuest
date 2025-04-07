import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationStudentsDialogComponent } from './formation-students-dialog.component';

describe('FormationStudentsDialogComponent', () => {
  let component: FormationStudentsDialogComponent;
  let fixture: ComponentFixture<FormationStudentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationStudentsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationStudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

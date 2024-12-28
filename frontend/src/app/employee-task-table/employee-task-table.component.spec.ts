import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskTableComponent } from './employee-task-table.component';

describe('EmployeeTaskTableComponent', () => {
  let component: EmployeeTaskTableComponent;
  let fixture: ComponentFixture<EmployeeTaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeTaskTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

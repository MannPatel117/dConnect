import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetprofileComponent } from './setprofile.component';

describe('SetprofileComponent', () => {
  let component: SetprofileComponent;
  let fixture: ComponentFixture<SetprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

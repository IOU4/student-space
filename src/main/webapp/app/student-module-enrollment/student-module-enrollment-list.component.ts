import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { StudentModuleEnrollmentService } from 'app/student-module-enrollment/student-module-enrollment.service';
import { StudentModuleEnrollmentDTO } from 'app/student-module-enrollment/student-module-enrollment.model';


@Component({
  selector: 'app-student-module-enrollment-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-module-enrollment-list.component.html'})
export class StudentModuleEnrollmentListComponent implements OnInit, OnDestroy {

  studentModuleEnrollmentService = inject(StudentModuleEnrollmentService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  studentModuleEnrollments?: StudentModuleEnrollmentDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@studentModuleEnrollment.delete.success:Student Module Enrollment was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.studentModuleEnrollmentService.getAllStudentModuleEnrollments()
        .subscribe({
          next: (data) => this.studentModuleEnrollments = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.studentModuleEnrollmentService.deleteStudentModuleEnrollment(id)
        .subscribe({
          next: () => this.router.navigate(['/studentModuleEnrollments'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}

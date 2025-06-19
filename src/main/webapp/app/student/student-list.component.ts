import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { StudentService } from 'app/student/student.service';
import { StudentDTO } from 'app/student/student.model';


@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.component.html'})
export class StudentListComponent implements OnInit, OnDestroy {

  studentService = inject(StudentService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  students?: StudentDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@student.delete.success:Student was removed successfully.`,
      'student.studentModuleEnrollment.studentUser.referenced': $localize`:@@student.studentModuleEnrollment.studentUser.referenced:This entity is still referenced by Student Module Enrollment ${details?.id} via field Student User.`
    };
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
    this.studentService.getAllStudents()
        .subscribe({
          next: (data) => this.students = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(apogeeNumber: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.studentService.deleteStudent(apogeeNumber)
        .subscribe({
          next: () => this.router.navigate(['/students'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/students'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error)
          }
        });
  }

}

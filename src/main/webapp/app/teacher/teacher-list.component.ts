import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { TeacherService } from 'app/teacher/teacher.service';
import { TeacherDTO } from 'app/teacher/teacher.model';


@Component({
  selector: 'app-teacher-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './teacher-list.component.html'})
export class TeacherListComponent implements OnInit, OnDestroy {

  teacherService = inject(TeacherService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  teachers?: TeacherDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@teacher.delete.success:Teacher was removed successfully.`,
      'teacher.modulee.teacher.referenced': $localize`:@@teacher.modulee.teacher.referenced:This entity is still referenced by Modulee ${details?.id} via field Teacher.`
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
    this.teacherService.getAllTeachers()
        .subscribe({
          next: (data) => this.teachers = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(firstName: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.teacherService.deleteTeacher(firstName)
        .subscribe({
          next: () => this.router.navigate(['/teachers'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/teachers'], {
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

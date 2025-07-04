import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ExamService } from 'app/exam/exam.service';
import { ExamDTO } from 'app/exam/exam.model';


@Component({
  selector: 'app-exam-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-list.component.html'})
export class ExamListComponent implements OnInit, OnDestroy {

  examService = inject(ExamService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  exams?: ExamDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@exam.delete.success:Exam was removed successfully.`    };
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
    this.examService.getAllExams()
        .subscribe({
          next: (data) => this.exams = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.examService.deleteExam(id)
        .subscribe({
          next: () => this.router.navigate(['/exams'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}

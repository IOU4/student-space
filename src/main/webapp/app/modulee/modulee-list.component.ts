import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ModuleeService } from 'app/modulee/modulee.service';
import { ModuleeDTO } from 'app/modulee/modulee.model';


@Component({
  selector: 'app-modulee-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './modulee-list.component.html'})
export class ModuleeListComponent implements OnInit, OnDestroy {

  moduleeService = inject(ModuleeService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  modulees?: ModuleeDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@modulee.delete.success:Modulee was removed successfully.`,
      'modulee.exam.modulee.referenced': $localize`:@@modulee.exam.modulee.referenced:This entity is still referenced by Exam ${details?.id} via field Modulee.`,
      'modulee.message.modulee.referenced': $localize`:@@modulee.message.modulee.referenced:This entity is still referenced by Message ${details?.id} via field Modulee.`,
      'modulee.studentModuleEnrollment.modulee.referenced': $localize`:@@modulee.studentModuleEnrollment.modulee.referenced:This entity is still referenced by Student Module Enrollment ${details?.id} via field Modulee.`
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
    this.moduleeService.getAllModulees()
        .subscribe({
          next: (data) => this.modulees = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.moduleeService.deleteModulee(id)
        .subscribe({
          next: () => this.router.navigate(['/modulees'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/modulees'], {
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

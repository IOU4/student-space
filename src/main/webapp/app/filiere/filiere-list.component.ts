import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { FiliereService } from 'app/filiere/filiere.service';
import { FiliereDTO } from 'app/filiere/filiere.model';


@Component({
  selector: 'app-filiere-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './filiere-list.component.html'})
export class FiliereListComponent implements OnInit, OnDestroy {

  filiereService = inject(FiliereService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  filieres?: FiliereDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@filiere.delete.success:Filiere was removed successfully.`,
      'filiere.modulee.filiere.referenced': $localize`:@@filiere.modulee.filiere.referenced:This entity is still referenced by Modulee ${details?.id} via field Filiere.`,
      'filiere.student.filiere.referenced': $localize`:@@filiere.student.filiere.referenced:This entity is still referenced by Student ${details?.id} via field Filiere.`
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
    this.filiereService.getAllFilieres()
        .subscribe({
          next: (data) => this.filieres = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.filiereService.deleteFiliere(id)
        .subscribe({
          next: () => this.router.navigate(['/filieres'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/filieres'], {
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

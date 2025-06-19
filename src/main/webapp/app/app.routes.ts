import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { FiliereListComponent } from './filiere/filiere-list.component';
import { FiliereAddComponent } from './filiere/filiere-add.component';
import { FiliereEditComponent } from './filiere/filiere-edit.component';
import { ModuleeListComponent } from './modulee/modulee-list.component';
import { ModuleeAddComponent } from './modulee/modulee-add.component';
import { ModuleeEditComponent } from './modulee/modulee-edit.component';
import { UserListComponent } from './user/user-list.component';
import { UserAddComponent } from './user/user-add.component';
import { UserEditComponent } from './user/user-edit.component';
import { StudentListComponent } from './student/student-list.component';
import { StudentAddComponent } from './student/student-add.component';
import { StudentEditComponent } from './student/student-edit.component';
import { TeacherListComponent } from './teacher/teacher-list.component';
import { TeacherAddComponent } from './teacher/teacher-add.component';
import { TeacherEditComponent } from './teacher/teacher-edit.component';
import { ExamListComponent } from './exam/exam-list.component';
import { ExamAddComponent } from './exam/exam-add.component';
import { ExamEditComponent } from './exam/exam-edit.component';
import { MessageListComponent } from './message/message-list.component';
import { MessageAddComponent } from './message/message-add.component';
import { MessageEditComponent } from './message/message-edit.component';
import { StudentModuleEnrollmentListComponent } from './student-module-enrollment/student-module-enrollment-list.component';
import { StudentModuleEnrollmentAddComponent } from './student-module-enrollment/student-module-enrollment-add.component';
import { StudentModuleEnrollmentEditComponent } from './student-module-enrollment/student-module-enrollment-edit.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Redirection...'
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: $localize`:@@admin.index.headline:Welcome to your new admin panel!`
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
    title: 'student-dashboard'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'filieres',
    component: FiliereListComponent,
    title: $localize`:@@filiere.list.headline:Filieres`
  },
  {
    path: 'filieres/add',
    component: FiliereAddComponent,
    title: $localize`:@@filiere.add.headline:Add Filiere`
  },
  {
    path: 'filieres/edit/:id',
    component: FiliereEditComponent,
    title: $localize`:@@filiere.edit.headline:Edit Filiere`
  },
  {
    path: 'modulees',
    component: ModuleeListComponent,
    title: $localize`:@@modulee.list.headline:Modulees`
  },
  {
    path: 'modulees/add',
    component: ModuleeAddComponent,
    title: $localize`:@@modulee.add.headline:Add Modulee`
  },
  {
    path: 'modulees/edit/:id',
    component: ModuleeEditComponent,
    title: $localize`:@@modulee.edit.headline:Edit Modulee`
  },
  {
    path: 'users',
    component: UserListComponent,
    title: $localize`:@@user.list.headline:Users`
  },
  {
    path: 'users/add',
    component: UserAddComponent,
    title: $localize`:@@user.add.headline:Add User`
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
    title: $localize`:@@user.edit.headline:Edit User`
  },
  {
    path: 'students',
    component: StudentListComponent,
    title: $localize`:@@student.list.headline:Students`
  },
  {
    path: 'students/add',
    component: StudentAddComponent,
    title: $localize`:@@student.add.headline:Add Student`
  },
  {
    path: 'students/edit/:apogeeNumber',
    component: StudentEditComponent,
    title: $localize`:@@student.edit.headline:Edit Student`
  },
  {
    path: 'teachers',
    component: TeacherListComponent,
    title: $localize`:@@teacher.list.headline:Teachers`
  },
  {
    path: 'teachers/add',
    component: TeacherAddComponent,
    title: $localize`:@@teacher.add.headline:Add Teacher`
  },
  {
    path: 'teachers/edit/:firstName',
    component: TeacherEditComponent,
    title: $localize`:@@teacher.edit.headline:Edit Teacher`
  },
  {
    path: 'exams',
    component: ExamListComponent,
    title: $localize`:@@exam.list.headline:Exams`
  },
  {
    path: 'exams/add',
    component: ExamAddComponent,
    title: $localize`:@@exam.add.headline:Add Exam`
  },
  {
    path: 'exams/edit/:id',
    component: ExamEditComponent,
    title: $localize`:@@exam.edit.headline:Edit Exam`
  },
  {
    path: 'messages',
    component: MessageListComponent,
    title: $localize`:@@message.list.headline:Messages`
  },
  {
    path: 'messages/add',
    component: MessageAddComponent,
    title: $localize`:@@message.add.headline:Add Message`
  },
  {
    path: 'messages/edit/:id',
    component: MessageEditComponent,
    title: $localize`:@@message.edit.headline:Edit Message`
  },
  {
    path: 'studentModuleEnrollments',
    component: StudentModuleEnrollmentListComponent,
    title: $localize`:@@studentModuleEnrollment.list.headline:Student Module Enrollments`
  },
  {
    path: 'studentModuleEnrollments/add',
    component: StudentModuleEnrollmentAddComponent,
    title: $localize`:@@studentModuleEnrollment.add.headline:Add Student Module Enrollment`
  },
  {
    path: 'studentModuleEnrollments/edit/:id',
    component: StudentModuleEnrollmentEditComponent,
    title: $localize`:@@studentModuleEnrollment.edit.headline:Edit Student Module Enrollment`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];

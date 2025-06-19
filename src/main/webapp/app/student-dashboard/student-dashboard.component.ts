import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StudentDashboardService, StudentDTO, ModuleeDTO, StudentModuleEnrollmentDTO } from './student-dashboard.service';
import { AuthService } from 'auth/auth.service';
import { TeacherService } from 'app/teacher/teacher.service';
import { TeacherDTO } from 'app/teacher/teacher.model';
import { ModuleChatComponent } from '../module-chat/module-chat.component';

// Define interfaces for our data structures for type safety
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  apogeeNumber: string;
  filiere: string; // The student's major/track
}

interface Module {
  id: number;
  name: string;
  teacherName: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true, // Using standalone components is modern Angular practice
  imports: [CommonModule, HttpClientModule, ModuleChatComponent],
  templateUrl: './student-dashboard.component.html',
  providers: [StudentDashboardService]
})
export class StudentDashboardComponent implements OnInit {
  router = inject(Router);
  service = inject(StudentDashboardService);
  authService = inject(AuthService);
  teacherService = inject(TeacherService);

  // --- MOCK DATA ---
  // In a real application, this data would come from a service that calls your API.

  student: StudentDTO | null = null;
  modules: ModuleeDTO[] = [];
  teachersMap: Record<string, TeacherDTO> = {};
  loading = false;
  currentAcademicYear: string = "2024-2025"; // This could also come from an API
  selectedModuleId: number | null = null;
  showChatModal: boolean = false;
  chatModuleId: number | null = null;

  ngOnInit(): void {
    // Simulate fetching data from a backend service
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    // Get student from AuthService (localStorage)
    this.student = this.authService.getUser();
    if (!this.student || !this.student.apogeeNumber) {
      // Not logged in as student, redirect to login
      this.router.navigate(['/login']);
      return;
    }
    const apogeeNumber = this.student.apogeeNumber;
    // Fetch all teachers first
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: TeacherDTO[]) => {
        this.teachersMap = {};
        teachers.forEach(t => { if (t.firstName) this.teachersMap[t.firstName] = t; });
        this.service.getStudentModuleEnrollments().subscribe({
          next: enrollments => {
            const studentEnrollments = enrollments.filter(e => e.studentUser === apogeeNumber);
            const moduleIds = studentEnrollments.map(e => e.modulee);
            // Fetch all modules in parallel
            Promise.all(moduleIds.map(id => this.service.getModulee(id).toPromise()))
              .then((modules: (ModuleeDTO | undefined)[]) => {
                this.modules = modules.filter((m): m is ModuleeDTO => m !== undefined);
                this.loading = false;
              })
              .catch(() => { this.loading = false; });
          },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  // --- Component Methods ---

  /**
   * Navigates to the chat page for a specific module.
   * @param moduleId The ID of the module chat to open.
   */
  viewChat(moduleId: number) {
    this.selectedModuleId = this.selectedModuleId === moduleId ? null : moduleId;
  }

  /**
   * Navigates to the past exams page for a specific module.
   * @param moduleId The ID of the module to view exams for.
   */
  viewExams(moduleId: number): void {
    console.log(`Navigating to exams for module ID: ${moduleId}`);
    // Example navigation: this.router.navigate(['/modules', moduleId, 'exams']);
    this.router.navigate(['/exams', moduleId]); // Or your actual exams route
  }

  openChatModal(moduleId: number) {
    this.chatModuleId = moduleId;
    this.showChatModal = true;
  }

  closeChatModal() {
    this.showChatModal = false;
    this.chatModuleId = null;
  }
}


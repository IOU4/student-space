import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StudentDashboardService, StudentDTO, ModuleeDTO, StudentModuleEnrollmentDTO } from './student-dashboard.service';

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
  imports: [CommonModule, HttpClientModule],
  templateUrl: './student-dashboard.component.html',
  providers: [StudentDashboardService]
})
export class StudentDashboardComponent implements OnInit {
  router = inject(Router);
  service = inject(StudentDashboardService);

  // --- MOCK DATA ---
  // In a real application, this data would come from a service that calls your API.

  student: StudentDTO | null = null;
  modules: ModuleeDTO[] = [];
  currentAcademicYear: string = "2024-2025"; // This could also come from an API

  ngOnInit(): void {
    // Simulate fetching data from a backend service
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const apogeeNumber = '23131';
    this.service.getStudent(apogeeNumber).subscribe(student => {
      this.student = student;
    });
    this.service.getStudentModuleEnrollments().subscribe(enrollments => {
      const studentEnrollments = enrollments.filter(e => e.student === apogeeNumber);
      const moduleIds = studentEnrollments.map(e => e.modulee);
      // Fetch all modules in parallel
      Promise.all(moduleIds.map(id => this.service.getModulee(id).toPromise()))
        .then((modules: (ModuleeDTO | undefined)[]) => {
          this.modules = modules.filter((m): m is ModuleeDTO => m !== undefined);
        });
    });
  }

  // --- Component Methods ---

  /**
   * Navigates to the chat page for a specific module.
   * @param moduleId The ID of the module chat to open.
   */
  viewChat(moduleId: number): void {
    console.log(`Navigating to chat for module ID: ${moduleId}`);
    // Example navigation: this.router.navigate(['/modules', moduleId, 'chat']);
    this.router.navigate(['/chat', moduleId]); // Or your actual chat route
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
}


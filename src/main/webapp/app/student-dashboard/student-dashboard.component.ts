import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
})
export class StudentDashboardComponent implements OnInit {

  router = inject(Router);

  // --- MOCK DATA ---
  // In a real application, this data would come from a service that calls your API.

  student: Student | null = null;
  modules: Module[] = [];
  currentAcademicYear: string = "2024-2025"; // This could also come from an API

  ngOnInit(): void {
    // Simulate fetching data from a backend service
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Placeholder for API call. We will use mock data for now.
    this.student = {
      id: 101,
      firstName: 'Fatima',
      lastName: 'Zahra',
      apogeeNumber: '19003456',
      filiere: 'Génie Informatique - S5'
    };

    this.modules = [
      { id: 1, name: 'Advanced Java & J2EE', teacherName: 'Prof. El Kettani' },
      { id: 2, name: 'Software Engineering & UML', teacherName: 'Prof. Alaoui' },
      { id: 3, name: 'Advanced Databases', teacherName: 'Prof. Benjelloun' },
      { id: 4, name: 'Compilation Theory', teacherName: 'Prof. Cherkaoui' },
      { id: 5, name: 'Web Development: Angular & Spring Boot', teacherName: 'Prof. Saadi' },
      { id: 6, name: 'Mobile Development', teacherName: 'Prof. Fikri' },
    ];
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


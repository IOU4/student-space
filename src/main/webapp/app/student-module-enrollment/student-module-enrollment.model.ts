export class StudentModuleEnrollmentDTO {

  constructor(data: Partial<StudentModuleEnrollmentDTO>) {
    Object.assign(this, data);
  }

  id?: number | null;
  enrollmentDate?: string | null;
  student?: string | null;
  modulee?: number | null;

}

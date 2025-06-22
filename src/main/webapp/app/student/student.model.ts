export class StudentDTO {

  constructor(data: Partial<StudentDTO>) {
    Object.assign(this, data);
  }

  apogeeNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  filiere?: number | null;
  email?: string | null;
}

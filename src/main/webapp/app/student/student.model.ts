export class StudentDTO {

  constructor(data:Partial<StudentDTO>) {
    Object.assign(this, data);
  }

  apogeeNumber?: string|null;
  firstName?: string|null;
  lastName?: string|null;
  createdAt?: string|null;
  user?: number|null;
  filiere?: number|null;

}

export class TeacherDTO {

  constructor(data: Partial<TeacherDTO>) {
    Object.assign(this, data);
  }

  firstName?: string | null;
  lastName?: string | null;
  specialty?: string | null;
  email?: string | null;
  phoneNumber?: string | null;

}

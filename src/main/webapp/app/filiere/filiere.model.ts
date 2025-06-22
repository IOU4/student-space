export class FiliereDTO {

  constructor(data: Partial<FiliereDTO>) {
    Object.assign(this, data);
  }

  id?: number | null;
  name?: string | null;
  academicYear?: string | null;
  description?: string | null;
  semester?: string | null;

}

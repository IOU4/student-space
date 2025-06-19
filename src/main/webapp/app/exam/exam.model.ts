export class ExamDTO {

  constructor(data:Partial<ExamDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  title?: string|null;
  examYear?: number|null;
  fileUrl?: string|null;
  uploadedAt?: string|null;
  modulee?: number|null;

}

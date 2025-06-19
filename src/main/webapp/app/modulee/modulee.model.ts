export class ModuleeDTO {

  constructor(data:Partial<ModuleeDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  description?: string|null;
  createdAt?: string|null;
  filiere?: number|null;
  teacher?: string|null;

}

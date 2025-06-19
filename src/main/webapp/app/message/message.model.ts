export class MessageDTO {

  constructor(data:Partial<MessageDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  content?: string|null;
  sentAt?: string|null;
  modulee?: number|null;
  senderUser?: number|null;

}

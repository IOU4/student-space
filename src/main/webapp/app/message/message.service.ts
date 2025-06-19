import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MessageDTO } from 'app/message/message.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class MessageService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/messages';

  getAllMessages() {
    return this.http.get<MessageDTO[]>(this.resourcePath);
  }

  getMessage(id: number) {
    return this.http.get<MessageDTO>(this.resourcePath + '/' + id);
  }

  createMessage(messageDTO: MessageDTO) {
    return this.http.post<number>(this.resourcePath, messageDTO);
  }

  updateMessage(id: number, messageDTO: MessageDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, messageDTO);
  }

  deleteMessage(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getModuleeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/moduleeValues')
        .pipe(map(transformRecordToMap));
  }

  getSenderUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/senderUserValues')
        .pipe(map(transformRecordToMap));
  }

}

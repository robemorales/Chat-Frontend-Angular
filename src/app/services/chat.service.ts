import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { MessageDTO } from '../DTO/MessageDTO';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:44379/chatsocket")
  .configureLogging(signalR.LogLevel.Information).build();
  readonly POST_URL = "https://localhost:44379/api/chat/send"

  private receivedMessageObject: MessageDTO = new MessageDTO();

  private sharedOdj =  new Subject<MessageDTO>();
  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();

    });
    this.connection.on("ReceiveOne", (user: any, message: any) => { this.mapReceivedMessage(user, message); });
    this.start();
  }

  public async start(){

    try {
      await this.connection.start();
      console.log("connected");

    } catch (err) {
      console.log(err)
      setTimeout(()=>this.start(), 5000);

    }
  }

  private mapReceivedMessage(user: string, message: string): void{
    this.receivedMessageObject.user = user;
    this.receivedMessageObject.msgText = message;
    this.sharedOdj.next(this.receivedMessageObject);
  }

  public broadcastMessage(msgDTO: any){
    this.http.post(this.POST_URL,msgDTO).subscribe(data => console.log(data));
  }

  public retrieveMappedObject(): Observable<MessageDTO>{
    return this.sharedOdj.asObservable();
  }
}

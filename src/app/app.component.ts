import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDTO } from 'src/app/DTO/MessageDTO';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'wep-chat-app';
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDTO) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent

  }

  msgDto: MessageDTO = new MessageDTO();
  msgInboxArray: MessageDTO[] = [];

  send(): void {
    if(this.msgDto) {
      if(this.msgDto.user.length == 0 || this.msgDto.user.length == 0){
        window.alert("Both fields are required.");
        return;
      } else {
        this.chatService.broadcastMessage(this.msgDto);                   // Send the message via a service
      }
    }
  }

  addToInbox(obj: MessageDTO) {
    let newObj = new MessageDTO();
    newObj.user = obj.user;
    newObj.msgText = obj.msgText;
    this.msgInboxArray.push(newObj);

  }

}

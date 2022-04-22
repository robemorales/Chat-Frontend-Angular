import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDTO } from 'src/app/DTO/MessageDTO';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wep-chat-app';
  constructor(private chatService: ChatService, public auth: AuthService) {}
  public name: string = "";
  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe( (receivedObj: MessageDTO) => { this.addToInbox(receivedObj);});  // calls the service method to get the new messages sent

  }

  msgDto: MessageDTO = new MessageDTO();
  msgInboxArray: MessageDTO[] = [];

  send(): void {
    if(this.msgDto) {
      if(this.msgDto.msgText.length == 0 ){
        window.alert("Both fields are required.");
        return;
      } else {
        this.chatService.broadcastMessage(this.msgDto);
        this.msgDto.msgText = '';
      }
    }
  }
  loadUser(){

  }

  addToInbox(obj: MessageDTO) {

    this.auth.user$.subscribe((profile)=>{
      this.name = JSON.stringify(profile,['name'])

    })

    let newObj = new MessageDTO();
    newObj.user = this.name;
    /*newObj.user = obj.user;*/
    newObj.msgText = obj.msgText;
    this.msgInboxArray.push(newObj);

  }

}

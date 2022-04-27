import {default as data} from '../../auth-config.json';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth:{
    domain: data.domain,
    clientId: data.clientId,
    redirectUri: window.location.origin,

  },
  hubConnectionURL: 'https://api-chat-signalr.herokuapp.com/chatsocket',
  broadcastURL: 'https://api-chat-signalr.herokuapp.com/api/chat/send'
};

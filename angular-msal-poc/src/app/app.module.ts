import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule, APP_INITIALIZER, Inject } from '@angular/core';
import { MsalModule, MsalService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { AppConfigService } from './app-config.service';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';



export function initializeApp(appConfigService: AppConfigService) {
  return () => lastValueFrom(appConfigService.loadConfig());
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: '', // Sarà sovrascritto dinamicamente
          authority: '', // Sarà sovrascritto dinamicamente
          redirectUri: '', // Sarà sovrascritto dinamicamente
        },
      }),
      {
        interactionType: InteractionType.Redirect, // or InteractionType.Popup
        authRequest: {
          scopes: ['user.read']
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
        ])
      }
    ),
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject('APP_CONFIG') private appConfig: any, private msalService: MsalService) {
    // Usa la configurazione caricata per configurare MSAL
   
    this.msalService.instance = new PublicClientApplication({
      auth: {
        clientId: this.appConfig.clientId,
        authority: this.appConfig.authority,
        redirectUri: this.appConfig.redirectUri,
      },
    });
  }
}
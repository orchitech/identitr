import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { App } from './app.component';

import { Game } from './game';
import { Help } from './help/help.component';
import { Score } from './score/score.component';
import {
  Logger, TimePipe, SystemComponent, UserComponent, LinkComponent, GameService, MdlInitDirective
} from './shared';

// Application wide providers
const APP_PROVIDERS = [
  GameService,
  Logger
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    Game,
    Help,
    Score,
    UserComponent,
    SystemComponent,
    LinkComponent,
    TimePipe,
    MdlInitDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    // {provide: Window, useValue: window},
    DragulaModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor() {}
}

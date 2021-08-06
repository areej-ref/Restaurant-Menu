import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AccordionModule} from 'primeng/accordion';
import {MenuItem} from 'primeng/api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MobxAngularModule} from 'mobx-angular';
import {TreeModule} from 'primeng/tree';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {ContextMenuModule} from 'primeng/contextmenu';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './layout/app.component';
import {HomeComponent} from './pages/home/home.component';

import {ConfigService} from './services/config.service';
import {ApplicationStateService} from './services/application-state.service';
import {ActionsComponent} from './components/actions/actions.component';
import {NodeFormComponent} from './components/node-form/node-form.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    ContextMenuModule,
    InputSwitchModule,
    ConfirmDialogModule,
    InputNumberModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MobxAngularModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ActionsComponent,
    NodeFormComponent
  ],
  providers: [
    ConfigService,
    ApplicationStateService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

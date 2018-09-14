import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Angular Google Map API Module
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';

// //Open Weather API Module
import { AngularWeatherWidgetModule, WeatherApiName } from 'angular-weather-widget';

// Import Angular material component module for dashboard view
import { 
        MatGridListModule,
        MatCardModule,
        MatToolbarModule,
        MatTableModule,
        MatDividerModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatButtonModule,
        MatButton,
        //MatGridTile,

      }from '@angular/material';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TempService } from '../../service/user.component.service';

const appRoutes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    data: { title: 'User List' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' }
  },
  { path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    // Google Map Angular API
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyA1pnL0RGSKlgyNpp_wxUZHqhB2zrlYoFU'
    }),
    
    // OpenWeather Angular API
    AngularWeatherWidgetModule.forRoot({
        key: '3bd9d02f315c368ec45b80f545d025bf',
        name: WeatherApiName.OPEN_WEATHER_MAP,
        baseUrl: 'http://api.openweathermap.org/data/2.5'
     }),

     //Angular Material API
    //  MatButtonModule, 
     MatGridListModule,
     MatCardModule,
     MatToolbarModule,
     MatTableModule,
     MatDividerModule,
     MatListModule,
     MatProgressSpinnerModule,
     MatInputModule,
     MatButtonModule,
     //MatProgressBarModule,
     //MatGridTile,

    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [TempService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router,ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { WeatherSettings, TemperatureScale, ForecastMode, WeatherLayout } from 'angular-weather-widget';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import * as socketIo from 'socket.io-client';
import {TempService} from "../../../service/user.component.service"
import { Subscription } from 'rxjs/Subscription';
import { Chart } from 'chart.js';
import { DISABLED } from '@angular/forms/src/model';

@Injectable()
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tempQuote: number;
  fahtempQuote: number;
  sub: Subscription;
  userInfo = { username:'', password:'', name:'hahatwz', area:'Syracuse', latitude:'112', longtitude:'80', phvalue:'7'};
  users: any;
  temps: any;
  chart: any;
  chartdata = {
    datasets: [
        {
            data: [50,50],
            backgroundColor: [
                "#304FFE",
                "#FFFFFF",
            ],
            hoverBackgroundColor: [
                "#304FFE",
                "#FFFFFF",
            ],
            hoverBorderColor: ["#FFFFFF"]
        }]}; 



  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute, private tempserve: TempService) {}

  ngOnInit() {

    // let httpOptions = {
    //   headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') }),
    // };
    // this.http.get('/api/signup', httpOptions).subscribe(data => {
    //   this.users = data;
    //   console.log(this.users);
    //   this.userInfo.name = this.users.name;
    //   this.userInfo.username = this.users.username;
    //   this.userInfo.area = this.users.area;
    //   this.userInfo.latitude = this.users.latitude;
    //   this.userInfo.longtitude = this.users.longtitude;
    //   this.userInfo.password = this.users.password;
    //   this.userInfo.phvalue = this.users.phvalue;
    //   console.log(this.userInfo);
    // }, err => {
    //   if(err.status === 401) {
    //     this.router.navigate(['login']);
    //   }
    // });

    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data:  this.chartdata,
      options : {   
           tooltips: {enabled:false},
           responsive: true,
           maintainAspectRatio: true,
           hover: {mode: null},
      }
    });

    this.sub = this.tempserve.getQuotes()
    .subscribe(quote => {
              this.temps = quote;
              this.tempQuote = parseFloat(this.temps);
              this.chartdata.datasets[0].data = [this.tempQuote, (33 - this.tempQuote) * 10];
              this.fahtempQuote = this.tempQuote * 1.8 +32;
              this.tempQuote = Math.round(this.tempQuote);
              this.fahtempQuote = Math.round(this.fahtempQuote);
              this.chart.update();
    });


  }

  updateUserInfo(){
    this.http.post('/api/update',this.userInfo).subscribe(resp => {
      //console.log(resp);
        this.lat = parseInt(this.userInfo.latitude)
        this.lng = parseInt(this.userInfo.longtitude)
        this.settings.location.cityName = this.userInfo.area
        //this.router.navigate(['users']);
    }, err => {
      console.log('Cannot update profile to database')
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

          // set up GoogleMap API
          zoom: number = 8;
          lat: number = 43.0481; // this.users.latitude
          lng: number = -76.1474; // this.users.longtitude;

          // set up OpenWeather API
          settings: WeatherSettings = {
            location: {
              cityName: 'syracuse' // this.users.Area
            },
            backgroundColor: '#ffffff',
            color: '#000000',
            width: '100%',
            height: '100%',
            showWind: true,
            scale: TemperatureScale.CELCIUS,
            forecastMode: ForecastMode.DETAILED,
            showDetails: true,
            showForecast: true,
            language: 'en'
          };


}

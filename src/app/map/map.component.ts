import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map').setView([51.505, -0.09], 5);
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}

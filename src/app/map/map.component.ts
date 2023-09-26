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
    this.countryBorders();
  }

  private initializeMap() {
    this.map = L.map('map', {'maxBoundsViscosity': 1.0, 'minZoom': 2,}).setView([51.505, -0.09], 2);
    var maxBounds =  L.latLngBounds(L.latLng(-80, -180), L.latLng(9999, 180));
    this.map.setMaxBounds(maxBounds);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0, maxZoom: 20
    }).addTo(this.map);
  }

  private countryBorders() {
    var geoJSONPath = '../assets/custom.geo.json';
    fetch(geoJSONPath).then(function(response) {
      return response.json();
    }).then((data) => {
      L.geoJSON(data).addTo(this.map);
    });
  }

  changeTheme(theme:string) {
    if (theme == 'Dark') {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        minZoom: 0, maxZoom: 20}).addTo(this.map);
    } else if (theme == 'Other') {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
        minZoom: 0, maxZoom: 18}).addTo(this.map);
    }
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}

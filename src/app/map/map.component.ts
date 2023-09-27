import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';

import geoJsondata from '../../assets/countries.geo.json';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  geojson: any;
  countryName: string = '';
  errorCountrySearch: boolean = false;
  layers: any = {};
  
  baseLayers: Record<string, L.TileLayer> = {
    'Dark' : L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0, maxZoom: 20}),
    'Other' : L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
      minZoom: 0, maxZoom: 18})
  };

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
    this.map = L.map('map', {'maxBoundsViscosity': 1.0, 'minZoom': 2, attributionControl: false,}).setView([51.505, -0.09], 2);
    var maxBounds =  L.latLngBounds(L.latLng(-80, -180), L.latLng(9999, 180));
    this.map.setMaxBounds(maxBounds);
    var layerControl = L.control.layers(this.baseLayers, {}).addTo(this.map);
    this.baseLayers['Dark'].addTo(this.map);
  }

  private countryBorders() {
    var geoJSONPath = '../assets/countries.geo.json';
    fetch(geoJSONPath).then(function(response) {
      return response.json();
    }).then((data) => {
      this.geojson = L.geoJSON(data, {
        style: { fillColor: '#FFFFFF', weight: 1, opacity: 0, color: 'white', dashArray: '3', fillOpacity: 0 },
        onEachFeature: this.onEachFeature.bind(this)}).addTo(this.map);
    });
  }

  highlightFeature(e:any) {
    e.target.setStyle({ weight: 1, opacity: 1, dashArray: '3', fillOpacity: 0.2 });
  }

  resetHighlight(e:any) {
    this.geojson.resetStyle(e.target);
  }

  onCountryClick(e:any) {
    this.countryName = e.target.feature.properties.name;
    this.errorCountrySearch = false;
  }

  onEachFeature(feature:any, layer:L.Layer) {
    this.layers[feature.properties.name] = layer;
    layer.on({ mouseover: this.highlightFeature, mouseout: this.resetHighlight.bind(this), click: this.onCountryClick.bind(this) });
  }

  pickCountry(country_name: string) {
    this.errorCountrySearch = true;
    for (let country of geoJsondata.features) {
      if(country_name == country['properties']['name']) {
        this.errorCountrySearch = false;
        this.countryName = country_name;
        this.map.fitBounds(this.layers[country_name].getBounds());
        break;
      }
    }
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { RESTAPIService } from '../services/rest-api.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';

import geoJsondata from '../../assets/map.geo.json';

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
    'OpenStreetMap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19}),
    'Dark' : L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0, maxZoom: 20}),
    'Watercolour': L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
      minZoom: 1, maxZoom: 16}),
    'Cycle': L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      minZoom: 1, maxZoom: 16}),
    'World' : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
  };

  overlays: Record<string, L.TileLayer> = {
    'RailwayMap': L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', { 
      maxZoom: 19})
  }

  constructor(
    private loginService: LoginService,
    private RESTService: RESTAPIService,
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
    var layerControl = L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
    this.baseLayers['OpenStreetMap'].addTo(this.map);
  }

  private countryBorders() {
    var geoJSONPath = '../assets/map.geo.json';
    fetch(geoJSONPath).then(function(response) {
      return response.json();
    }).then((data) => {
      this.geojson = L.geoJSON(data, {
        style: { fillColor: 'black', weight: 1, opacity: 0, color: 'white', dashArray: '3', fillOpacity: 0 },
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
    var cca3 = e.target.feature.properties.A3;
    this.RESTService.getCountryFROMA3(cca3).subscribe((data) => {
      this.countryName = Object(data)["name"]["common"];
    });
    this.errorCountrySearch = false;
  }

  onEachFeature(feature:any, layer:L.Layer) {
    this.layers[feature.properties.A3] = layer;
    layer.on({ mouseover: this.highlightFeature, mouseout: this.resetHighlight.bind(this), click: this.onCountryClick.bind(this) });
  }

  pickCountry(input: string) {
    this.RESTService.getA3FROMCountry(input).subscribe((data) => {
      var cca3 = Object(data)[0]["cca3"];

      for (let country of geoJsondata.features) {
        if(cca3 == country['properties']['A3']) {
          this.RESTService.getCountryFROMA3(cca3).subscribe((data) => {
            this.countryName = Object(data)["name"]["common"];
          });
          this.errorCountrySearch = false;
          this.map.fitBounds(this.layers[cca3].getBounds());
          break;
        }
        this.errorCountrySearch = true;
      }
    })
  }

  onLogout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
  }
}

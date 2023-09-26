import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;

  constructor() { }

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
}

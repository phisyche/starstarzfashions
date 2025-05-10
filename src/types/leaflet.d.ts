
declare module 'leaflet' {
  export function map(element: HTMLElement | string): Map;
  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
  export function marker(latLng: LatLngExpression, options?: MarkerOptions): Marker;
  
  export interface LeafletEvent {
    originalEvent: Event;
    type: string;
    target: any;
  }

  export interface Icon {
    options: any;
  }
  
  export interface IconOptions {
    iconUrl: string;
    iconRetinaUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    shadowUrl?: string;
    shadowRetinaUrl?: string;
    shadowSize?: [number, number];
    shadowAnchor?: [number, number];
    className?: string;
  }

  export interface LatLngExpression {
    lat: number;
    lng: number;
  }
  
  export interface MarkerOptions {
    icon?: Icon;
    title?: string;
    alt?: string;
    zIndexOffset?: number;
    opacity?: number;
    riseOnHover?: boolean;
    riseOffset?: number;
  }

  export interface TileLayerOptions {
    minZoom?: number;
    maxZoom?: number;
    maxNativeZoom?: number;
    minNativeZoom?: number;
    subdomains?: string | string[];
    errorTileUrl?: string;
    zoomOffset?: number;
    tms?: boolean;
    zoomReverse?: boolean;
    detectRetina?: boolean;
    crossOrigin?: boolean | string;
    attribution?: string;
  }

  export interface Map {
    setView(center: LatLngExpression, zoom: number): this;
    remove(): this;
  }

  export interface Layer {
    addTo(map: Map): this;
  }

  export interface TileLayer extends Layer {}
  
  export interface Marker extends Layer {
    bindPopup(content: string): this;
    openPopup(): this;
  }

  export function icon(options: IconOptions): Icon;
}

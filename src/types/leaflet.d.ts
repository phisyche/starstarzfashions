
declare module 'leaflet' {
  export interface LeafletEvent {
    originalEvent: Event;
    type: string;
    target: any;
  }

  export class Icon {
    constructor(options: any);
  }

  export namespace Marker {
    interface Options {
      icon?: Icon;
    }
  }

  export class Marker {
    static prototype: {
      options: Marker.Options;
    };
  }
  
  export function icon(options: any): Icon;
}

// Import necessary modules
import { Component, AfterViewInit, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.control.layers.tree';
import  'leaflet-kml';
import * as ExifReader from 'exifreader';
import * as togeojson from '@tmcw/togeojson';
import { icon } from 'leaflet';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import 'leaflet.fullscreen';
import {UPCdata} from '../kml-visualizer/mission';
import { Feature, Point } from 'geojson';
import 'leaflet.offline';
import 'leaflet-measure';

@Component({
  selector: 'kml-visualizer',
  templateUrl: './kml-visualizer.component.html',
  styleUrls: ['./kml-visualizer.component.scss']
})

export class KmlVisualizerComponent implements AfterViewInit {
  myForm: FormGroup;
  imageSource: any;
  imageData: any;
  map: any;
  marker: any;
  markers: any[] = [];
  streetMap: any;
  satelliteMap: any;
  baseMaps: any;
  treeControl: any;
  latitude : any;
  longitude : any;
  geojsonData: any;
  geojsonLayer: any;
  allImages: any;
  drawMode : any;
  FullScreen: boolean = false;
  baseLayersControl:any;
  imageDataArray: any[] = [];
  distanceFailArray: any[] = [];
  angleFailArray: any[] = [];
  altitudeFailArray: any[] = [];
  speedFailArray: any[] = [];
  totalFailArray: any[]= [];
   chainageFeatureGroups: any;
  chainages:any;
  chainagesCL:any;
  geometryCL:any;
  filteredDataArray: any[] = [];
  showDistancePlot: boolean = false;
  showAnglePlot: boolean = false;
  showSpeedPlot: boolean = false;
  showAltitudePlot: boolean = false;
  showtotalPlot: boolean = false;
  processingComplete = false;
  isReportVisible: boolean = false;
  chainagesLatLng: any;
  formattedLatitudes: string[] = [];
  formattedLongitudes: string[] = [];
  showAltitudeList: boolean = false;
  showSpeedList: boolean = false;
  showDistanceList: boolean = false;
  showAngleList: boolean = false;
  listActive: boolean = false;
  @ViewChild('heightInput') heightInput!: ElementRef;
  speedInput: any;
  heightValue: number | null = null;
  
  UPCListItems = [
    { name: "Delhi-Amritsar-Katra (Haryana part2) - N/01004/01002/HR", value: '1' },
    { name: "Solan - Kaithlighat Section of NH-22 Now NH-5 from Km. 106.139 to Km.129.05", value: '2' },
    { name: "DL/UP Border - EPE Crossing (Pkg-02)", value: '3' },
    { name: "Ahmedabad - Dholera (Pkg I) from km. 0.00 to km. 22.00", value: '4' },
    { name: "4L of Munger Mirzachauki section from Km 95+580 to Km 125+000 (Pkg-2)", value: '5' },
    { name: "Delhi-Vadodara Greenfield Alignment (NH-148N) (Pkg-05) (Ch.115+700 to Ch. 151+840)", value: '6' },
    { name: "Ismailabad - Narnaul (Pkg-01) (Ch. 0+000 to Ch. 23+000)", value: '7' },
  ];


  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      // your form controls
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    
  };

  listShowHide() {
    this.listActive = !this.listActive;
  }

  // initMap(): void {
  //   const accessToken = 'pk.eyJ1IjoiYWdhbmpvbyIsImEiOiJjamU2ZTA5MXcxc2ozMzBycWEzNXM4aDAzIn0.axzF_Kq3StzWSmQC8hoccg'; // Replace with your Mapbox access token
  //   this.streetMap = L.tileLayer(
  //     'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + accessToken,
  //     { maxZoom: 22,}
  //   );
  //   this.satelliteMap = L.tileLayer(
  //     'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/{z}/{x}/{y}?access_token=' + accessToken,
  //     { maxZoom: 22}
  //   );
  //   this.baseMaps = {
  //     Streets: this.streetMap,
  //     Satellite: this.satelliteMap
  //   };
  //   this.map = L.map('map', {
  //     center: [28.584802, 77.3218893],
  //     zoom: 4,
  //     // maxNativeZoom: 18,
  //     minZoom: 1,
  //     maxZoom: 22,
  //     // tileBuffer: 2,
  //     attributionControl: false,
  //     zoomControl: false,
  //     layers: [this.streetMap],
  //   });
  //    /***********************changes */
  //   this.baseLayersControl = L.control.layers(this.baseMaps).addTo(this.map);
  //   this.baseLayersControl.setPosition('topright');
  //   L.control.zoom({ position: 'topleft' }).addTo(this.map);
  //       // Add fullscreen control
  //       const fullscreenControl = new (L.Control as any).Fullscreen();
  //       this.map.addControl(fullscreenControl);
  //       fullscreenControl.setPosition('bottomright');
  // }

  initMap(): void {
    const accessToken = 'pk.eyJ1IjoiYWdhbmpvbyIsImEiOiJjamU2ZTA5MXcxc2ozMzBycWEzNXM4aDAzIn0.axzF_Kq3StzWSmQC8hoccg';
    
    // Define tile layers
    this.streetMap = L.tileLayer(
      'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=' + accessToken,
      { maxZoom: 22 }
    );
    this.satelliteMap = L.tileLayer(
      'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/{z}/{x}/{y}?access_token=' + accessToken,
      { maxZoom: 22 }
    );

    // Base maps
    this.baseMaps = {
      Streets: this.streetMap,
      Satellite: this.satelliteMap
    };

    // Initialize map
    this.map = L.map('map', {
      center: [28.584802, 77.3218893],
      zoom: 4,
      minZoom: 1,
      maxZoom: 22,
      attributionControl: false,
      zoomControl: false,
      layers: [this.streetMap],
    });

    // Add base layers control
    this.baseLayersControl = L.control.layers(this.baseMaps).addTo(this.map);
    this.baseLayersControl.setPosition('topright');
    L.control.zoom({ position: 'topleft' }).addTo(this.map);

    // Add fullscreen control
    const fullscreenControl = new (L.Control as any).Fullscreen();
    this.map.addControl(fullscreenControl);
    fullscreenControl.setPosition('bottomright');

  //   L.measure = {
  //     linearMeasurement: 'Distance',
  //     areaMeasurement: 'Area',
  //     start: 'Start',
  //     meter: 'm',
  //     kilometer: 'km',
  //     squareMeter: 'm²',
  //     squareKilometers: 'km²',
  // };

  // Creating Pan
  // this.map.createPane('measure');
  // this.map.getPane('measure').style.zIndex = 400;
  new (L.Control as any).measure({ position: 'topright' }).addTo(this.map);

    // Initialize Leaflet Offline
    const offline = new (L.Control as any).Offline({
      // Optional configuration options
      cacheName: 'map-tiles',
      // maxCacheSize: 100000000, // 100 MB
    });
    
    // Add offline control to the map
    this.map.addControl(offline);

    // Enable caching
    const offlineLayer = new (L.tileLayer as any).offline(this.streetMap);
    this.map.addLayer(offlineLayer);
    
    // To cache tiles when the user is online
    this.map.on('moveend', () => {
      offlineLayer.addTile(this.map.getCenter(), this.map.getZoom());
    });

}
   
  getHeightValue(){
    //  return this.heightInput.nativeElement.value;
      this.speedInput = this.heightInput.nativeElement.value;
      this.heightValue = this.speedInput;
      console.log("speedInputspeedInput", this.speedInput)
  }

  selectedFiles: { [key: string]: File[] } = {
    centerLine: [],
    row: [],
    chainage: [],
};

   onFileSelected(event: any) {
    console.log("eventtttt", event);
    const allFiles = event.target.files;
    for (let i = 0; i < allFiles.length; i++) {
      console.log(allFiles[i], 'allFiles[i]');
      const kml = allFiles[i];
      console.log("kmllllll",  kml);
        this.renderBrowsedKmlOnMap(kml);
    }
  }

  // onFileSelected(event: Event, type: string) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     const files = Array.from(input.files);
  //     this.selectedFiles[type] = files; // Store the selected files

  //     // Optionally render the KML on the map for each selected file
  //     files.forEach(file => {
  //       console.log(file, 'Selected file');
  //       this.renderBrowsedKmlOnMap(file);
  //     });
  //   }
  // }

  // onFileTypeChange(event: any): void {
  //   console.log("event", event);
  //   const selectedFileType = event.target.value;
  //   console.log("Selected file type:", selectedFileType);
  //   this.plotgeometry(selectedFileType);
  //   // this.imageDataArray = [];
  //   // this.angleFailArray = [];
  //   // this.distanceFailArray = [];
  //   // this.speedFailArray =[];
  //   // this.altitudeFailArray =[];
  // }

//    plotgeometry(selectedFileType) {
//     console.log("Selected file type2222:", selectedFileType);
//     // Remove existing layers from the map
//     if (this.chainageFeatureGroups) {
//         this.map.removeLayer(this.chainageFeatureGroups);
//     }
//     this.allImages  = null;
//     let chainageFeatureGroups = L.featureGroup(); // Initialize a single feature group
//     let allBounds = L.latLngBounds([]);
//     UPCdata.forEach((item, i) => {
//         console.log("item>>>>", item);
//         if (item.UPC == selectedFileType) {
//             const geometry = item.cl.features;
//             if (item.cl.file_name.endsWith('CL')) {
//               // alert("clll")
//                 // Define a green color style function
//                 function style(feature) {
//                     return {
//                         color: '#008000',  // Green color
//                         weight: 2,         // Line weight (if you have lines)
//                         fillOpacity: 0.5   // Fill opacity (if you have polygons)
//                     };
//                 }
//                 if (!Array.isArray(item.cl.features)) {
//                     console.error('Invalid features data in layer:', item.cl);
//                     return;
//                 }
//                 item.cl.features.forEach((shLyr) => {
//                     let layer = L.geoJson(shLyr, {
//                         style: style, // Apply the green style
//                         pointToLayer: function (feature, latlng) {
//                             // Custom styling for point features if needed
//                             return L.circleMarker(latlng, {
//                                 color: '#00FF00', // Green color
//                                 radius: 5 // Adjust size if needed
//                             });
//                         }
//                     });
//                     chainageFeatureGroups.addLayer(layer);
//                     if (layer.getBounds) {
//                         allBounds.extend(layer.getBounds());
//                     }
//                 });
//                 // Add the feature group to the map
//                 if (this.map) {
//                     this.map.addLayer(chainageFeatureGroups);
//                     // Fit the map view to the bounds of the added layers
//                     this.map.fitBounds(allBounds);
//                 } else {
//                     console.error('Map instance is not available');
//                 }
//             }
//           this.chainagesLatLng = item.ch.features; 
//           if (item.ch.file_name.endsWith('CH')) {
//             // alert("chhh");
//             // Define a style function for polygons or lines
//             function style(feature) {
//                 return {
//                     color: '#000000',  // Line or polygon color
//                     weight: 2,         // Line weight
//                     fillOpacity: 0.5   // Fill opacity
//                 };
//             }
//             // // Define a custom icon for point features
//             // const chainageIcon = L.circleMarker({
//             // });
//             // Check if features is an array
//             if (!Array.isArray(item.ch.features)) {
//                 console.error('Invalid features data in layer:', item.ch);
//                 return;
//             }
//             // Create a feature group to hold all the layers
//             let chainageFeatureGroups = L.featureGroup();
//             let allBounds = L.latLngBounds([]);
//             // Wrap features in a FeatureCollection if not already
//             let featureCollection;
//             if (item.ch.features.length === 1 && item.ch.features[0].type === 'Feature') {
//                 featureCollection = item.ch.features[0];
//             } else {
//                 featureCollection = {
//                     type: "FeatureCollection",
//                     features: item.ch.features
//                 };
//             };
//             console.log("featureCollection>>>>",featureCollection)
//             let layer = L.geoJson(featureCollection, {
//                 style: style, // Apply the style for polygons or lines
//                 pointToLayer: function (feature, latlng) {
//                   console.log(">>>>>featureeeee", feature)
//                   console.log(">>>>>feature,latlnggg", latlng)

//                     // Custom styling for point features with icons
//                     if (feature.geometry.type === 'Point') {
//                         // Create a marker with a custom icon
//                         let marker = L.circleMarker(latlng);
//                         marker.setRadius(5);
//                         marker.setStyle({
//                           color: 'blue', // Outline color
//                           fillColor: 'blue', // Fill color
//                           fillOpacity: 0.5 // Opacity of the fill color
//                       });
//                         // Add a popup with chainage information
//                         if (feature.properties && feature.properties.Chainage) {
//                             marker.bindPopup(`<b>Chainage:</b> ${feature.properties.Chainage}`);
//                         }
//                         return marker;
//                     } else {
//                         return L.circleMarker(latlng, {
//                             color: '#000000', // Color for circles
//                             radius: 5 // Adjust size if needed
//                         });
//                     }
//                 }
//             });
//             chainageFeatureGroups.addLayer(layer);
//             if (layer.getBounds) {
//                 allBounds.extend(layer.getBounds());
//             }
        
//             // Add the feature group to the map
//             if (this.map) {
//                 this.map.addLayer(chainageFeatureGroups);
//                 // Fit the map view to the bounds of the added layers
//                 this.map.fitBounds(allBounds);
//             } else {
//                 console.error('Map instance is not available');
//             }
//         }
//         // if (item.ch.features.length >= 2) {
//         //   const [chainage1, chainage2] = item.ch.features.slice(0, 2);
//         //   const imagesBetweenChainages = this.findImagesBetweenChainages(chainage1, chainage2, this.imageDataArray);
//         //   console.log("Images between chainages:", imagesBetweenChainages);
//         // }
//         // const allImages = this.imageDataArray;
//         // console.log("imagessdddddd>>>>", this.imageDataArray);
//         // const matchedImages = this.findMatchingImages(item.ch.features, allImages);
//         // console.log("matcheddddd>>>",matchedImages);
//         const imagesBetweenTwo = this.findImagesBetweenTwoChainages(item.ch.features[0], item.ch.features[1], this.imageDataArray, 0.0001);
// console.log("Images between two chainages:", imagesBetweenTwo);

// // Find images between all consecutive chainages
// const imagesBetweenAll = this.findImagesBetweenMultipleChainages(item.ch.features, this.imageDataArray);
// console.log("Images between multiple chainages:", imagesBetweenAll);
    
//         }
//     });
//     // Store the feature group for later reference
//     this.chainageFeatureGroups = chainageFeatureGroups;
// }


//   onFileSelected(event){
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//         const file = input.files[0];
//         const reader = new FileReader();
//         reader.onload = async (e: ProgressEvent<FileReader>) => {
//             if (e.target && e.target.result) {
//                 const arrayBuffer = e.target.result as ArrayBuffer;
//                 try {
//                     const geojson = await shp(arrayBuffer);
//                     this.chainages = geojson;
//                     this.chainages.map((data)=>{
//                         data.features.map((data)=>{
//                             if(data?.geometry?.bbox){
//                                 delete data.geometry['bbox'];
                                
//                             }
//                         })
//                     })
//                      console.log("chainagessss", this.chainages);
//                     this.chainagesCL = this.chainages.filter((data) => data.fileName.includes('CL'))[0];
//                      console.log("chainagessss", this.chainagesCL);
//                     const featureWithGeometry = this.chainagesCL.features.find(feature => feature.geometry !== null);
//                      console.log("featureWithGeometry", featureWithGeometry)
//                     if (featureWithGeometry) {
//                         // Access the geometry of the first feature with non-null geometry
//                         this.geometryCL = featureWithGeometry.geometry;
//                         console.log("Geometry found:", this.geometryCL);
//                         console.log("typeGeometry found:", typeof(this.geometryCL));
//                     } else {
//                         console.log("No features with geometry found.");
//                     }
//                 } catch (error) {
//                     console.error("Error converting file to GeoJSON:", error);
//                 }
//             }
//         };
//         reader.onerror = (error) => {
//             console.error("FileReader error:", error);
//         };
//         reader.readAsArrayBuffer(file);
        
//     }
    
// }


// renderChainage() {
//   let chainageFeatureGroups = {};
//   let self = this;

//   if (!Array.isArray(this.chainages)) {
//     console.error('Invalid chainages data');
//     return;
//   }

//   let allBounds = L.latLngBounds([]);

//   this.chainages.forEach((lyr, i) => {
//     if (lyr.fileName.endsWith('CL')) {
     
//       chainageFeatureGroups[i] = L.featureGroup();

//       // Define a green color style function
//       function style(feature) {
//         return {
//           color: '#013220',  // Green color
//           weight: 2,         // Line weight (if you have lines)
//           fillOpacity: 0.5   // Fill opacity (if you have polygons)
//         };
//       }

//       if (!Array.isArray(lyr.features)) {
//         console.error('Invalid features data in layer:', lyr);
//         return;
//       }

//       lyr.features.forEach((shLyr) => {
//         let layer = L.geoJson(shLyr, {
//           style: style, // Apply the green style
//           pointToLayer: function (feature, latlng) {
//             // Custom styling for point features if needed
//             return L.circleMarker(latlng, {
//               color: '#00FF00', // Green color
//               radius: 5 // Adjust size if needed
//             });
//           }
//         });

//         chainageFeatureGroups[i].addLayer(layer);

//         if (layer.getBounds) {
//           allBounds.extend(layer.getBounds());
//         }
//       });

//       if (this.map) {
//         this.map.addLayer(chainageFeatureGroups[i]);
//       } else {
//         console.error('Map instance is not available');
//       }
//     }
//   });

//   if (this.map && allBounds.isValid()) {
//     this.map.fitBounds(allBounds);
//   } else {
//     console.error('Map instance is not available or bounds are invalid');
//   }
// }


  async renderBrowsedKmlOnMap(kml: Blob | MediaSource) {
    let filename = kml;
    const path = (window.URL || window.webkitURL).createObjectURL(kml);
     console.log("pathhhhhh", path);
  
    fetch(path)
      .then((res) => res.text())
      .then((kmltext) => {
        console.log(kmltext, 'kmltext kmltext');
        const parser = new DOMParser();
        const kmlData = parser.parseFromString(kmltext, 'text/xml');
        console.log("kmldataaaaa   typeeee", typeof kmlData );
        // convert kml to geojson
         this.geojsonData = togeojson.kml(kmlData);
         console.log("geojsondata", this.geojsonData );
         //Plot geojson in leaflet map
         const geojsonLayer = L.geoJSON(this.geojsonData, {
          pointToLayer: (geoJsonPoint: Feature<Point, any>, latlng: L.LatLng): L.Layer => {
            const chainage = geoJsonPoint.properties.Chainage || "No Chainage"; // Adjust this according to your properties
            const marker = L.marker(latlng);
            marker.bindTooltip(chainage); // Display tooltip on hover
            return marker; // Always returns a Leaflet marker
          }
        }).addTo(this.map);
        // const geojsonLayer = L.geoJSON(this.geojsonData).addTo(this.map);
        const bounds = geojsonLayer.getBounds();
        this.map.fitBounds(bounds);
      });
    }

  // drawKml(){
  //   this.geojsonLayer = L.geoJSON(this.geojsonData).addTo(this.map);
  //   const bounds = this.geojsonLayer.getBounds();
  //   this.map.fitBounds(bounds);
  // }


haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radius of the Earth in m
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Function to convert EXIF date-time string to JavaScript Date object
    parseExifDate(dateTimeArray : any): Date {
      console.log(">>>dateTimeArray",dateTimeArray)
      if (!dateTimeArray || dateTimeArray.length === 0) {
          throw new Error("Invalid date-time array");
      }

      const dateTimeStr = dateTimeArray; // Extract the date-time string from the array
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [year, month, day] = datePart.split(':').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      // Create a Date object from the parsed values
      return new Date(year, month - 1, day, hour, minute, second);
    }
 
      // Function to calculate time difference in seconds between two EXIF date-time arrays
      calculateTimeDifferenceInSeconds(dateTimeArray1 : any[], dateTimeArray2:any[]): number {
        const date1 = this.parseExifDate(dateTimeArray1);
        const date2 = this.parseExifDate(dateTimeArray2);

        // Calculate the difference in milliseconds
        const timeDiffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

        // Convert milliseconds to seconds
        return timeDiffInMilliseconds / 1000;
      }

      roundToDecimalPlaces(num: number, decimalPlaces: number): number {
        if (isNaN(num)) return num; // Handle case if num is not a number
        const factor = 10 ** decimalPlaces;
        return Math.round(num * factor) / factor;
    };

    extractDate(dateTimeString: string): string {
      return dateTimeString.split(' ')[0];
  }

      calculateCoverageWidth = (fov: number, height: number): number => {
        // const cheight = parseFloat(height);
          return 2 * height * Math.tan(fov / 2);
      };
   
      calculateCoverageHeigth = (fov: number, height: number): number => {
        // const cheight = parseFloat(height);
          return 2 * height * Math.tan(fov / 2);
      };

      calculateNumberOfImages = (coverageWidth: number, coverageHeight: number, areaWidth: number, areaHeight: number, overlapPercentage: number): number => {
        // Adjust coverage dimensions based on overlap
        const effectiveCoverageWidth = coverageWidth * (1 - overlapPercentage / 100);
        const effectiveCoverageHeight = coverageHeight * (1 - overlapPercentage / 100);
    
        const numImagesWidth = Math.ceil(areaWidth / effectiveCoverageWidth);
        const numImagesHeight = Math.ceil(areaHeight / effectiveCoverageHeight);
    
        return numImagesWidth * numImagesHeight;
    };
    


  // Function to calculate FoV given width and focal length
          calculateFoV = (width: number, focalLength: string): number => {
            console.log("focalLength>>>>", focalLength);
            // Convert width to number
            // const swidth = parseFloat(width);
            // if (isNaN(swidth)) {
            //     console.error('Invalid sensorWidth');
            //     return 0;
            // }
            // Extract the numeric part of focalLength (e.g., from "f/2.8" get 2.8)
            // const focalLengthMatch = focalLength.match(/(\d+(\.\d+)?)/);
            // if (!focalLengthMatch) {
            //     console.error('Invalid focalLength format');
            //     return 0;
            // }
            // Convert the extracted value to a number
            const f = parseFloat(focalLength);
            console.log("swidth>>>>", width);
            console.log("f>>>>", f);
            // Check for valid focalLength value
            if (isNaN(f) || f === 0) {
                console.error('Invalid focalLength value');
                return 0; 
            }
            // Calculate FoV in radians
            const arctan = width / (2 * f);
            const fovRadians = 2 * Math.atan(arctan);
            console.log("fovRadians>>>>", fovRadians);
            // // Convert radians to degrees
             const fovDegrees = fovRadians * (180 / Math.PI);
            // console.log("fovDegrees>>>>", fovDegrees);
             return fovRadians;
            };

async onFileSelect(event: any) {
  this.imageDataArray = [];
  console.log(">>>>>>>>>>event", event);
  const files = event.target.files;
  console.log(">>>>>>>>>>files", files);
  this.allImages = Array.from(files);
  console.log(">>>>>>>>>>files", this.allImages);
  // Process the selected files
  await this.processImages(this.allImages);
}

sortImageDataArray(imageData :any) {
  return imageData.sort((a :any, b:any) => {
      const latA = parseFloat(a.latitude);
      const latB = parseFloat(b.latitude);

      // First, sort by latitude
      if (latA < latB) return -1;
      if (latA > latB) return 1;

      // If latitudes are equal, sort by longitude
      const lonA = parseFloat(a.longitude);
      const lonB = parseFloat(b.longitude);

      if (lonA < lonB) return -1;
      if (lonA > lonB) return 1;

      return 0; // They are equal
  });
}

async processImages(images: File[]) {
  // Convert FileReader reading to a promise-based function
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: any) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
      });
  };
  for (const image of images) {
      try {
          const arrayBuffer = await readFileAsArrayBuffer(image);
          const tags = ExifReader.load(arrayBuffer);
          console.log(">>>>>>>tags", tags);
          console.log(">>>>>>>size", image.size);

          // Helper function to safely extract and convert EXIF data
          const getTagValue = (tag: any) => {
              if (Array.isArray(tag)) return tag[0];
              if (typeof tag === 'string') return tag;
              if (tag && tag.description) return tag.description;
              return null;
          };
          const angle = tags['GimbalPitchDegree'] ? parseFloat(tags['GimbalPitchDegree'].value) : null;
          const roundedAngle = angle !== null && !isNaN(angle) ? this.roundToDecimalPlaces(Math.abs(angle), 0) : null;
          const relativeAltitudeFeet = getTagValue(tags['RelativeAltitude']);
          const relativeAltitudeMeters = (parseFloat(relativeAltitudeFeet)).toFixed() ? (parseFloat(relativeAltitudeFeet)).toFixed() : null;
          const createDate = getTagValue(tags.DateTimeOriginal);
          const formattedDate = createDate ? this.extractDate(createDate) : null;
          const imageData = {
              latitude: getTagValue(tags.GPSLatitude),
              longitude: getTagValue(tags.GPSLongitude),
              name: image.webkitRelativePath,
              altitude: relativeAltitudeMeters,
              createDate: formattedDate,
              angle: roundedAngle,
              time: getTagValue(tags.DateTimeOriginal),
              distance: null,
              speed: null,
              distanceStatus: '',
              angleStatus: '',
              altitudeStatus: '',
              speedStatus: '',
              overallStatus: '',
          };
          console.log("imagedatat", imageData)
          this.imageDataArray.push(imageData);
          console.log("Updated imageDataArray", this.imageDataArray);
          let sortedArray = this.sortImageDataArray(this.imageDataArray)
          console.log("sortedimageDataArray", this.imageDataArray);
          this.validateData(sortedArray);
      } catch (error) {
          console.error("Error reading EXIF data:", error);
      }
  }
  // let sortedArray = this.sortImageDataArray(this.imageDataArray)
  // console.log("sortedimageDataArray", this.imageDataArray);
  // this.validateData(sortedArray);
  this.processingComplete = true;
  console.log("imagefaaasaa", this.imageDataArray)
  console.log('Image data processing complete.');
}

validateData(sortedArray :any[]){
  console.log("formmmvalue333", this.speedInput);
  console.log("formmmvalue333", typeof(this.speedInput));
 
  let Height = parseFloat(this.speedInput);
  console.log("HeightHeight", (Height));

  console.log("HeightHeight", typeof(Height));
  let prevImageData = sortedArray[0];
  sortedArray.forEach((image) => {
     console.log("imageeeee", image);
     console.log("altitude>>>>", (image.altitude));
     console.log("altitude>>>>", typeof(image.altitude));
     image.angleStatus = image.angle == 90 ? 'Pass' : 'Fail';
     console.log("HeightHeight222", (Height));
     image.altitudeStatus = image.altitude > Height ? 'Fail' : 'Pass';
     if (prevImageData) {
      if (prevImageData.latitude && prevImageData.longitude && image.latitude && image.longitude) {
        const lat1 = parseFloat(prevImageData.latitude);
        const lon1 = parseFloat(prevImageData.longitude);
        const lat2 = parseFloat(image.latitude);
        const lon2 = parseFloat(image.longitude);
        // Calculate distance
        const distance = this.haversineDistance(lat1, lon1, lat2, lon2);
        console.log("distance>>>>", distance)
        const roundedDistance = distance.toFixed();
        prevImageData.distance = roundedDistance;
        prevImageData.distanceStatus = prevImageData.distance > 10 ? 'Fail' : 'Pass';
        // Calculate time difference
        const timeDiffInSeconds = this.calculateTimeDifferenceInSeconds(prevImageData.time, image.time);
        console.log("timeDiffInSeconds>>", timeDiffInSeconds)
        // if (timeDiffInSeconds > 0) {
          let speed = 0; // Default speed to 0
          if (timeDiffInSeconds > 0) {
            speed = distance / timeDiffInSeconds;
          }
          console.log("spedddd>>>", speed)
          const roundedSpeed = speed.toFixed();
          prevImageData.speed = roundedSpeed;
          prevImageData.speedStatus = prevImageData.speed > 5 ? 'Fail' : 'Pass';
        // }
      } else {
        image.distance = 0;
        image.speed = 0;
      }
      if (prevImageData.distanceStatus == 'Fail' || image.angleStatus == 'Fail' || image.altitudeStatus == 'Fail' || prevImageData.speedStatus == 'Fail') {
        prevImageData.overallStatus = 'Fail';
      } else {
        prevImageData.overallStatus = 'Pass';
      }
    }
      this.distanceFailArray = this.imageDataArray.filter(item => item.distanceStatus === 'Fail');
      this.speedFailArray = this.imageDataArray.filter(item => item.speedStatus === 'Fail');
      this.angleFailArray = this.imageDataArray.filter(item => item.angleStatus === 'Fail');
      this.altitudeFailArray = this.imageDataArray.filter(item => item.altitudeStatus === 'Fail');
      this.totalFailArray = this.imageDataArray.filter(item => item.overallStatus === 'Fail');
      prevImageData = image;
  })
  console.log("totalFailArraytotalFailArray>>>", this.totalFailArray);
  const Chainage=  this.findFailedChainage(this.geojsonData, this.imageDataArray);
  console.log("ChainageChainage>>", Chainage);
}

  findFailedChainage(geoJson:any, imageArray:any[]) {
  return imageArray.map(image => {
      let nearestChainage = null;
      let minDistance = Infinity;
      for (const feature of geoJson.features) {
          const [long, lat] = feature.geometry.coordinates;
          // Calculate distance to the image coordinates
          const distance = this.haversineDistance(image.latitude, image.longitude, lat, long);
          // Check if this distance is the closest so far
          if (distance < minDistance) {
            // alert("called")
              minDistance = distance;
              nearestChainage = feature.properties.Chainage; // Save the nearest Chainage
          }
          else{
            // NoImage = "No Image Found"
          }
      }
      return {
          imageName: image.name,
          nearestChainage,
          // NoImage,
          // minDistance
      }; // Return the result for the current image
  });
}


// async processImages(images: File[]) {
//   // Convert FileReader reading to a promise-based function
//   const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
//       return new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = (e: any) => resolve(e.target.result);
//           reader.onerror = reject;
//           reader.readAsArrayBuffer(file);
//       });
//   };
//   let prevImageData = null;
//   for (const image of images) {
//       try {
//           const arrayBuffer = await readFileAsArrayBuffer(image);
//           const tags = ExifReader.load(arrayBuffer);
//           console.log(">>>>>>>tags", tags);
//           console.log(">>>>>>>size", image.size);

//           // Helper function to safely extract and convert EXIF data
//           const getTagValue = (tag: any) => {
//               if (Array.isArray(tag)) return tag[0];
//               if (typeof tag === 'string') return tag;
//               if (tag && tag.description) return tag.description;
//               return null;
//           };
//           const angle = tags['GimbalPitchDegree'] ? parseFloat(tags['GimbalPitchDegree'].value) : null;
//           const roundedAngle = angle !== null && !isNaN(angle) ? this.roundToDecimalPlaces(Math.abs(angle), 0) : null;
//           const relativeAltitudeFeet = getTagValue(tags['RelativeAltitude']);
//           const relativeAltitudeMeters = relativeAltitudeFeet ? (parseFloat(relativeAltitudeFeet) * 0.3048).toFixed() : null;
//           const createDate = getTagValue(tags.DateTimeOriginal);
//           const formattedDate = createDate ? this.extractDate(createDate) : null;
//           const imageData = {
//               latitude: getTagValue(tags.GPSLatitude),
//               longitude: getTagValue(tags.GPSLongitude),
//               name: image.name,
//               altitude: relativeAltitudeMeters,
//               createDate: formattedDate,
//               angle: roundedAngle,
//               time: getTagValue(tags.DateTimeOriginal),
//               distance: null,
//               speed: null,
//               distanceStatus: '',
//               angleStatus: '',
//               altitudeStatus: '',
//               speedStatus: '',
//               overallStatus: '',
//           };
//           console.log("imagedatat", imageData)
//           // let width = getTagValue(tags.FocalLength.description);
//           // // let f = getTagValue(tags.FNumber.description);
//           // let f = getTagValue(tags.FocalLength.description);
//           // const horizontalFoV = this.calculateFoV(36, f);
//           // console.log(`Horizontal FoV: ${horizontalFoV.toFixed(2)} degrees`);
//           // const coverageWidth = this.calculateCoverageWidth(horizontalFoV, 24);
//           // console.log("coverageWidth>>>", coverageWidth);
//           // const coverageHeight = this.calculateCoverageHeigth(horizontalFoV, 24);
//           // console.log("coverageHeight>>>", coverageHeight);
//           // const NumberOfImages = this.calculateNumberOfImages(coverageWidth,coverageHeight,100,45,85);
//           // console.log("NumberOfImages>>>", NumberOfImages);
//           // let arctan = width/f;
//           imageData.angleStatus = imageData.angle == 90 ? 'Pass' : 'Fail';
//           imageData.altitudeStatus = imageData.altitude > '45' ? 'Fail' : 'Pass';
//           if (prevImageData) {
//                 //   if (prevImageData.altitude && imageData.altitude) {
//                 //     const prevAltitude = parseFloat(prevImageData.altitude);
//                 //     const currentAltitude = parseFloat(imageData.altitude);
//                 //     const altitudeChange = Math.abs(currentAltitude - prevAltitude);
//                 //     const threshold = 0.05 * prevAltitude; // 5% of the previous altitude

//                 //     imageData.altitudeStatus = altitudeChange <= threshold ? 'Pass' : 'Fail';
//                 // } else {
//                 //     imageData.altitudeStatus = 'Pass'; // No previous altitude to compare
//                 // }
//               if (prevImageData.latitude && prevImageData.longitude && imageData.latitude && imageData.longitude) {
//                   const lat1 = parseFloat(prevImageData.latitude);
//                   const lon1 = parseFloat(prevImageData.longitude);
//                   const lat2 = parseFloat(imageData.latitude);
//                   const lon2 = parseFloat(imageData.longitude);
//                   // Calculate distance
//                   const distance = this.haversineDistance(lat1, lon1, lat2, lon2);
//                   const roundedDistance = distance.toFixed(2);
//                   console.log("distance b/w", prevImageData.name, "and", imageData.name, "is", distance);
//                   prevImageData.distance = roundedDistance;
//                   prevImageData.distanceStatus = prevImageData.distance > 10 ? 'Fail' : 'Pass';
//                   // Calculate time difference
//                   const timeDiffInSeconds = this.calculateTimeDifferenceInSeconds(prevImageData.time, imageData.time);
//                   console.log("Time difference (in seconds) between", prevImageData.name, "and", imageData.name, "is", timeDiffInSeconds);
//                   if (timeDiffInSeconds > 0) {
//                       const speed = distance / timeDiffInSeconds;
//                       const roundedSpeed = speed.toFixed(2);
//                       prevImageData.speed = roundedSpeed;
//                       prevImageData.speedStatus = prevImageData.speed > 5 ? 'Fail' : 'Pass';
//                       console.log("Speed between", prevImageData.name, "and", imageData.name, "is", speed);
//                   }
//               } else {
//                   imageData.distance = 0;
//                   imageData.speed = 0;
//               }
//               if (prevImageData.distanceStatus == 'Fail' || imageData.angleStatus == 'Fail' || imageData.altitudeStatus == 'Fail' || prevImageData.speedStatus == 'Fail') {
//                 prevImageData.overallStatus = 'Fail';
//             } else {
//               prevImageData.overallStatus = 'Pass';
//             }
//           }
//           this.distanceFailArray = this.imageDataArray.filter(item => item.distanceStatus === 'Fail');
//           this.speedFailArray = this.imageDataArray.filter(item => item.speedStatus === 'Fail');
//           this.angleFailArray = this.imageDataArray.filter(item => item.angleStatus === 'Fail');
//           this.altitudeFailArray = this.imageDataArray.filter(item => item.altitudeStatus === 'Fail');
//           this.imageDataArray.push(imageData);
//           console.log("Updated imageDataArray", this.imageDataArray);
//           // Update previous image data
//           prevImageData = imageData;
//       } catch (error) {
//           console.error("Error reading EXIF data:", error);
//       }
//   }
//   this.imageDataArray = this.sortImageDataArray(this.imageDataArray)
//   this.processingComplete = true;
//   console.log('Image data processing complete.');
// }

    // findMatchingImages(features: any[], images: any[]) {
    //   console.log("features>>>>fgff",features)
    //   console.log("images>>>>fgff",images)
    //   return features.map((feature) => {
    //     // Destructure the coordinates from the feature's geometry
    //     const [longitude, latitude] = feature.geometry.coordinates;
    //     // Find all images that match the feature's latitude and longitude
    //     const matchingImages = images.filter((image) =>
    //       // Use a precision check (to avoid floating-point comparison issues)
    //       Math.abs(image.latitude - latitude) < 0.0009 &&
    //       Math.abs(image.longitude - longitude) < 0.0009
    //     );

    //     // Return an object with chainageId and the matching images
    //     return {
    //       chainageId: feature.chainageId,
    //       milestone: feature.mileStone,
    //       images: matchingImages,
    //     };
    //   });
    // }

    // findMatchingImages(features, images) {
    //      console.log("features>>>>fgff",features)
    //   console.log("images>>>>fgff",images)
    //   // Initialize an empty array to store results
    //   const results = [];
    //   // Iterate over each feature
    //   features.forEach((feature) => {
    //     const [longitude, latitude] = feature.geometry.coordinates;
    //       const matchingImages = images.filter((image) =>
    //         Math.abs(image.latitude - latitude) < 0.0009 &&
    //         Math.abs(image.longitude - longitude) < 0.0009
    //       );
    //       // Add the result to the results array
    //       results.push({
    //         chainageId: feature.chainageId,
    //         milestone: feature.milestone,
    //         images: matchingImages,
    //       });
    //     // }
    //   });
    //   return results;
    // }

  //   findImagesBetweenMultipleChainages(features, images) {
  //     // Initialize an array to store results
  //     const results = [];
  //     // Loop through each pair of consecutive chainages
  //     for (let i = 0; i < features.length - 1; i++) {
  //         const chainage1 = features[i];
  //         const chainage2 = features[i + 1];
  //         // Call the function for two chainages
  //         const matchingImages = this.findImagesBetweenTwoChainages(chainage1, chainage2, images, 0.00001);
  //         // Store results
  //         results.push({
  //             fromChainageId: chainage1.chainageId,
  //             fromMilestone : chainage1.mileStone,
  //             toChainageId: chainage2.chainageId,
  //             toMilestone : chainage2.mileStone,
  //             images: matchingImages
  //         });
  //     }
  //     return results;
  // }

  //   findImagesBetweenTwoChainages(chainage1, chainage2, images) {
  //     // Extract coordinates for both chainages
  //     const [lng1, lat1] = chainage1.geometry.coordinates;
  //     const [lng2, lat2] = chainage2.geometry.coordinates;
  
  //     // Define bounding box coordinates
  //     const minLat = Math.min(lat1, lat2);
  //     const maxLat = Math.max(lat1, lat2);
  //     const minLng = Math.min(lng1, lng2);
  //     const maxLng = Math.max(lng1, lng2);
  
  //     // Find images within the bounding box
  //     return images.filter(image =>
  //         image.latitude >= minLat &&
  //         image.latitude <= maxLat &&
  //         image.longitude >= minLng &&
  //         image.longitude <= maxLng
  //     );
  // }

  // Calculate images between two chainages with a buffer
findImagesBetweenTwoChainages(chainage1:any, chainage2:any, images:any, buffer:any) {
  // Extract coordinates for both chainages
  const [lng1, lat1] = chainage1.geometry.coordinates;
  const [lng2, lat2] = chainage2.geometry.coordinates;

  // Define bounding box coordinates with buffer
  const minLat = Math.min(lat1, lat2) - buffer;
  const maxLat = Math.max(lat1, lat2) + buffer;
  const minLng = Math.min(lng1, lng2) - buffer;
  const maxLng = Math.max(lng1, lng2) + buffer;

  // Find images within the bounding box
  return images.filter((image: { latitude: number; longitude: number; })  =>
    image.latitude >= minLat &&
    image.latitude <= maxLat &&
    image.longitude >= minLng &&
    image.longitude <= maxLng
  );
}

  // findImagesBetweenTwoChainages(chainage1, chainage2, images, bufferDistance = 2) {
  //   const [lng1, lat1] = chainage1.geometry.coordinates;
  //   const [lng2, lat2] = chainage2.geometry.coordinates;
  
  //   // Function to calculate distance between two lat/lng points
  //   function calculateDistance(lat1, lng1, lat2, lng2) {
  //     const R = 6371; // Earth radius in km
  //     const dLat = (lat2 - lat1) * Math.PI / 180;
  //     const dLng = (lng2 - lng1) * Math.PI / 180;
  //     const a =
  //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  //       Math.sin(dLng / 2) * Math.sin(dLng / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //     return R * c * 1000; // Convert to meters
  //   }
  
  //   // Function to determine if a point is within the buffer zone around the line segment
  //   function isPointInBufferZone(pointLat, pointLng, lat1, lng1, lat2, lng2, buffer) {
  //     const distToStart = calculateDistance(pointLat, pointLng, lat1, lng1);
  //     const distToEnd = calculateDistance(pointLat, pointLng, lat2, lng2);
  //     const lineLength = calculateDistance(lat1, lng1, lat2, lng2);
  //     return distToStart + distToEnd <= lineLength + buffer;
  //   }
  
  //   // Filter images within the buffer zone
  //   return images.filter(image => 
  //     isPointInBufferZone(image.latitude, image.longitude, lat1, lng1, lat2, lng2, bufferDistance)
  //   );
  // }
  
  
  

   onPlot(){
    this.plotImages();
  //   if(this.allImages && this.imageDataArray.length > 0 ){
  //     // alert("both")
  //     console.log("geodata", this.geojsonData );
  //     console.log("imagedata", this.allImages );
  //     // this.renderChainage();
  //     // this.distanceFailArray = this.imageDataArray.filter(item => item.distanceStatus === 'Fail');
  //     //     this.speedFailArray = this.imageDataArray.filter(item => item.speedStatus === 'Fail');
  //     //     this.angleFailArray = this.imageDataArray.filter(item => item.angleStatus === 'Fail');
  //     //     this.altitudeFailArray = this.imageDataArray.filter(item => item.altitudeStatus === 'Fail');
  //     // await this.processImages(this.allImages);
  //   }
  //  else if(this.chainages ){
  //   // alert("kml")
  //     console.log("geodata", this.geojsonData );
  //     // this.drawKml();
  //     // this.renderChainage();
  //   }
  //   else {
  //     // alert("image")
  //     console.log("imagedata", this.allImages );
  //     if(this.imageDataArray.length > 0 ){
  //       this.distanceFailArray = this.imageDataArray.filter(item => item.distanceStatus === 'Fail');
  //       this.speedFailArray = this.imageDataArray.filter(item => item.speedStatus === 'Fail');
  //       this.angleFailArray = this.imageDataArray.filter(item => item.angleStatus === 'Fail');
  //       this.altitudeFailArray = this.imageDataArray.filter(item => item.altitudeStatus === 'Fail');
  //     }
  //     // this.drawMarker();
  //   //  await this.processImages(this.allImages);

  //   }
  //   this.isReportVisible =true;
  }

  // onCheckboxChange(plotType: string, event: Event) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   if (plotType === 'angle') {
  //     if (isChecked) {
  //       this.angleFailPlot();
  //     } else {
  //       // this.clearData();
  //       this.markers.forEach(marker => {
  //         this.map.removeLayer(marker);
  //       });
  //       this.markers = [];
  //     }
  //   }
  //   if (plotType === 'distance') {
  //     if (isChecked) {
  //       this.distanceFailPlot();
  //     } else {
  //       // this.clearData();
  //       this.markers.forEach(marker => {
  //         this.map.removeLayer(marker);
  //       });
  //       this.markers = [];
  //      }
  //   }
  //   if (plotType === 'speed') {
  //     if (isChecked) {
  //       this.speedFailPlot();
  //     } 
  //     else {
  //       // this.clearData();
  //       this.markers.forEach(marker => {
  //         this.map.removeLayer(marker);
  //       });
  //       this.markers = [];
  //     }
  //   }
  //   if (plotType === 'altitude') {
  //     if (isChecked) {
  //       this.altitudeFailPlot();
  //     } else {
  //       this.markers.forEach(marker => {
  //         this.map.removeLayer(marker);
  //       });
  //       this.markers = [];
  //       // this.clearData();
  //     }
  //   }

  // }
  onCheckboxChange(plotType: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (plotType === 'total') {
      this.showtotalPlot = isChecked;
    }
    
    if (plotType === 'angle') {
      this.showAnglePlot = isChecked;
    }
    if (plotType === 'distance') {
      this.showDistancePlot = isChecked;
    }
    if (plotType === 'speed') {
      this.showSpeedPlot = isChecked;
    }
    if (plotType === 'altitude') {
      this.showAltitudePlot = isChecked;
    }

    this.clearMarkers();
    this.updateTable();
    this.updateMap();
  }
  clearMarkers() {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  // updateTable() {
  //   this.filteredDataArray = this.imageDataArray.filter(item => {
  //     if (this.showDistancePlot && item.distanceStatus === 'Fail') return true;
  //     if (this.showAnglePlot && item.angleStatus === 'Fail') return true;
  //     if (this.showSpeedPlot && item.speedStatus === 'Fail') return true;
  //     if (this.showAltitudePlot && item.altitudeStatus === 'Fail') return true;
  //     return false;
  //   });
  //   console.log("filteredDataArray>>>>>",this.filteredDataArray);
  // }
  updateTable() {
      // Define a union type for the filter keys
      // type FilterKeys = 'distance' | 'angle' | 'speed' | 'altitude' |'total';
      const colorMap = {
        totalImages: 'green',
        distanceFail: 'yellow',
        angleFail: 'purple',
        speedFail: 'red',
        altitudeFail: 'orange',
        // Add more colors as needed for other statuses
    };
      // Create a filter function for each status
      const filters = {
        total: (item :any) => this.showtotalPlot,
        distance: (item :any) => this.showDistancePlot && item.distanceStatus === 'Fail',
        angle: (item :any) => this.showAnglePlot && item.angleStatus === 'Fail',
        speed: (item :any) => this.showSpeedPlot && item.speedStatus === 'Fail',
        altitude: (item :any) => this.showAltitudePlot && item.altitudeStatus === 'Fail'
      };
  
      // Filter imageDataArray based on the active filters
      this.filteredDataArray = this.imageDataArray
          .map(item => {
              let color = null;
              if (this.showDistancePlot && item.distanceStatus === 'Fail') {
                  color = colorMap.distanceFail;
              } else if (this.showAnglePlot && item.angleStatus === 'Fail') {
                  color = colorMap.angleFail;
              } else if (this.showSpeedPlot && item.speedStatus === 'Fail') {
                  color = colorMap.speedFail;
              } else if (this.showAltitudePlot && item.altitudeStatus === 'Fail') {
                  color = colorMap.altitudeFail;
              }
             else if (this.showtotalPlot) {
              color = colorMap.totalImages;
            }
              return color ? { ...item, color } : null;
          })
          .filter(item => item !== null);
  // Extract the latitude values
const latitudes = this.filteredDataArray.map(item => item.latitude);

// Extract the longitude values
const longitudes = this.filteredDataArray.map(item => item.longitude);

// Find the top 2 maximum latitude values
const maxLatitudes = [...latitudes];

// Find the top 2 maximum longitude values
const maxLongitudes = [...longitudes];

// Format the results to 2 decimal places
const formattedLatitudes = maxLatitudes.map(lat => lat.toFixed(2));
const formattedLongitudes = maxLongitudes.map(lng => lng.toFixed(2));

// Print the formatted results
console.log("Top 2 Latitude values:", formattedLatitudes);
console.log("Top 2 Longitude values:", formattedLongitudes);

  
    console.log("filteredDataArray>>>>>", this.filteredDataArray);
  }
  
  
  
  // updateMap() {
  //   const bounds = L.latLngBounds([]);
  //   if (this.showDistancePlot) this.distanceFailPlot();
  //   if (this.showAnglePlot) this.angleFailPlot();
  //   if (this.showSpeedPlot) this.speedFailPlot();
  //   if (this.showAltitudePlot) this.altitudeFailPlot();

  //   // if (this.markers.length > 0) {
  //   //   this.map.fitBounds(bounds);
  //   // }
  // }
  updateMap() {
    const bounds = L.latLngBounds([]);
   console.log("filteredDataArrayplottttt>>>>>", this.filteredDataArray);
    // Clear existing markers
    this.clearMarkers();
  
    // Add new markers based on the filtered data
    this.filteredDataArray.forEach(item => {
      // Create a marker based on the item's location
      const marker = L.circleMarker([item.latitude, item.longitude]); // Adjust this as needed
      marker.addTo(this.map);
      marker.setRadius(4);
      marker.setStyle({
        color: item.color, // Outline color
        fillColor: item.color, // Fill color
        fillOpacity: 0.5 // Opacity of the fill color
    });
  
      // Extend bounds to include this marker
      bounds.extend(marker.getLatLng());

      marker.on('mouseover', () => {
        const tooltipContent = `<b>${item.name}</b><br>Latitude: ${item.latitude}<br>Longitude: ${item.longitude}`;
        marker.bindTooltip(tooltipContent, { permanent: true, direction: 'top' }).openTooltip();
      });
  
      marker.on('mouseout', () => {
        marker.closeTooltip();
      });
  
      // Optionally, add custom content to the marker
      // marker.bindPopup(`<b>${item.name}</b><br>Latitude: ${item.latitude}<br>Longitude: ${item.longitude}`).openPopup(); // Adjust popup content as needed
  
      // Add marker to the markers array
      this.markers.push(marker);
    });
  
    // Adjust map bounds to fit markers if any
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds);
    }
  }

  plotImages() {
    const bounds = L.latLngBounds([]);
  //  console.log("filteredDataArrayplottttt>>>>>", this.filteredDataArray);
    // Clear existing markers
    this.clearMarkers();
    alert(this.imageDataArray.length)
  
    // Add new markers based on the filtered data
    this.imageDataArray.forEach(item => {
      // Create a marker based on the item's location
      const marker = L.circleMarker([item.latitude, item.longitude]); // Adjust this as needed
      marker.addTo(this.map);
      marker.setRadius(6);
      marker.setStyle({
        color: 'red', // Outline color
        fillColor: 'red', // Fill color
        fillOpacity: 0.5 // Opacity of the fill color
    });
  
      // Extend bounds to include this marker
      bounds.extend(marker.getLatLng());
  
      // Optionally, add custom content to the marker
      marker.bindPopup(`<b>${item.name}</b><br>Latitude: ${item.latitude}<br>Longitude: ${item.longitude}`).openPopup(); // Adjust popup content as needed
  
      // Add marker to the markers array
      this.markers.push(marker);
    });
  
    // Adjust map bounds to fit markers if any
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds);
    }
  }
  

  onCancel(): void{
    // this.clearData();
    // alert("cancel")
    location.reload();
  }

 }





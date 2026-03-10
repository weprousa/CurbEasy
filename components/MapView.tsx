
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Theme } from '../types';
import { MapPin, Info, AlertTriangle, Clock, CircleParking } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  theme: Theme;
  userLocation?: { lat: number; lng: number };
}

interface ParkingSpot {
  id: string;
  lat: number;
  lng: number;
  type: 'available' | 'occupied' | 'restricted';
  address: string;
  rules: string;
}

interface CleaningZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  day: string;
  time: string;
  status: 'active' | 'upcoming' | 'clear';
}

const MapUpdater: React.FC<{ center: [number, number], forceRecenter: number }> = ({ center, forceRecenter }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map, forceRecenter]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ theme, userLocation }) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [cleaningZones, setCleaningZones] = useState<CleaningZone[]>([]);
  const [filter, setFilter] = useState<'all' | 'parking' | 'cleaning'>('all');
  const [forceRecenter, setForceRecenter] = useState(0);

  // NYC Center (Manhattan)
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [40.7588, -73.9851];

  useEffect(() => {
    // Mock data generation for NYC
    const mockParking: ParkingSpot[] = [
      { id: 'p1', lat: 40.7580, lng: -73.9855, type: 'available', address: 'W 44th St & 7th Ave', rules: '2hr Metered Parking' },
      { id: 'p2', lat: 40.7595, lng: -73.9840, type: 'occupied', address: 'W 46th St & Broadway', rules: 'No Standing Except Commercial' },
      { id: 'p3', lat: 40.7570, lng: -73.9870, type: 'available', address: 'W 42nd St & 8th Ave', rules: '1hr Parking 8am-6pm' },
      { id: 'p4', lat: 40.7610, lng: -73.9820, type: 'restricted', address: 'W 48th St & 6th Ave', rules: 'No Parking Anytime' },
      { id: 'p5', lat: 40.7550, lng: -73.9830, type: 'available', address: 'W 40th St & 5th Ave', rules: '4hr Metered Parking' },
    ];

    const mockCleaning: CleaningZone[] = [
      { id: 'c1', lat: 40.7600, lng: -73.9860, radius: 150, day: 'Monday', time: '8:30 AM - 10:00 AM', status: 'upcoming' },
      { id: 'c2', lat: 40.7560, lng: -73.9810, radius: 200, day: 'Tuesday', time: '11:00 AM - 12:30 PM', status: 'clear' },
      { id: 'c3', lat: 40.7620, lng: -73.9880, radius: 180, day: 'Wednesday', time: '9:00 AM - 10:30 AM', status: 'active' },
    ];

    setParkingSpots(mockParking);
    setCleaningZones(mockCleaning);
  }, []);

  const getMarkerIcon = (type: string) => {
    let color = '#1745cf';
    if (type === 'occupied') color = '#94a3b8';
    if (type === 'restricted') color = '#ef4444';
    if (type === 'available') color = '#22c55e';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Map Controls */}
      <div className={`p-4 flex gap-2 overflow-x-auto no-scrollbar ${theme === 'dark' ? 'bg-slate-900' : 'bg-white/50'}`}>
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'all' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Zones
        </button>
        <button 
          onClick={() => setFilter('parking')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'parking' 
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
              : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Parking Spots
        </button>
        <button 
          onClick={() => setFilter('cleaning')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'cleaning' 
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' 
              : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Cleaning Zones
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative z-0">
        <MapContainer 
          center={center} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapUpdater center={center} forceRecenter={forceRecenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={theme === 'dark' 
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={L.divIcon({
                className: 'user-location-icon',
                html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); position: relative;">
                        <div style="position: absolute; inset: -4px; background-color: #3b82f6; border-radius: 50%; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                       </div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
            >
              <Popup>
                <div className="p-1 text-center">
                  <p className="font-bold text-xs">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Parking Markers */}
          {(filter === 'all' || filter === 'parking') && parkingSpots.map(spot => (
            <Marker 
              key={spot.id} 
              position={[spot.lat, spot.lng]} 
              icon={getMarkerIcon(spot.type)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleParking className={`w-4 h-4 ${spot.type === 'available' ? 'text-green-600' : spot.type === 'occupied' ? 'text-slate-400' : 'text-red-600'}`} />
                    <span className="font-bold text-sm capitalize">{spot.type} Spot</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {spot.address}
                  </p>
                  <p className="text-[10px] text-slate-500 bg-slate-100 p-1.5 rounded border border-slate-200">
                    {spot.rules}
                  </p>
                  {spot.type === 'available' && (
                    <button className="w-full mt-2 bg-primary text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
                      Navigate Here
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Cleaning Zones */}
          {(filter === 'all' || filter === 'cleaning') && cleaningZones.map(zone => (
            <React.Fragment key={zone.id}>
              <Circle 
                center={[zone.lat, zone.lng]} 
                radius={zone.radius}
                pathOptions={{ 
                  color: zone.status === 'active' ? '#ef4444' : zone.status === 'upcoming' ? '#f59e0b' : '#10b981',
                  fillColor: zone.status === 'active' ? '#ef4444' : zone.status === 'upcoming' ? '#f59e0b' : '#10b981',
                  fillOpacity: 0.2,
                  dashArray: zone.status === 'upcoming' ? '5, 10' : undefined
                }}
              />
              <Marker 
                position={[zone.lat, zone.lng]}
                icon={L.divIcon({
                  className: 'cleaning-icon',
                  html: `<div style="color: ${zone.status === 'active' ? '#ef4444' : '#f59e0b'};"><span class="material-symbols-outlined" style="font-size: 20px;">${zone.status === 'active' ? 'warning' : 'schedule'}</span></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              >
                <Popup>
                  <div className="p-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-4 h-4 ${zone.status === 'active' ? 'text-red-600' : 'text-amber-600'}`} />
                      <span className="font-bold text-sm">Street Cleaning</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        <span>{zone.day}, {zone.time}</span>
                      </div>
                      <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                        zone.status === 'active' ? 'bg-red-100 text-red-700' : 
                        zone.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {zone.status}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
          <button 
            onClick={() => {
              if (userLocation) {
                setForceRecenter(prev => prev + 1);
              } else {
                alert("Please use the 'My Location' button in the top bar to find your coordinates first.");
              }
            }}
            className={`p-3 rounded-full shadow-xl border backdrop-blur-md transition-all active:scale-95 ${
              theme === 'dark' ? 'bg-slate-800/90 border-slate-700 text-blue-400' : 'bg-white/90 border-slate-200 text-primary'
            }`}
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        <div className={`absolute bottom-6 left-4 z-[1000] p-3 rounded-2xl shadow-xl border backdrop-blur-md ${
          theme === 'dark' ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
        }`}>
          <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Map Legend</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
              <span className="text-[10px] font-medium">Available Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400 border border-white"></div>
              <span className="text-[10px] font-medium">Occupied Spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 opacity-30 border border-amber-500"></div>
              <span className="text-[10px] font-medium">Cleaning Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;

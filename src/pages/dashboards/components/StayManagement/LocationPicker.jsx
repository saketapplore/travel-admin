import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2, X, Crosshair } from 'lucide-react';
import { trStaysService } from '../../../../services/trStaysService';

// Fix Leaflet's default marker icon paths (broken by bundlers like Vite)
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [20.5937, 78.9629]; // India

// Recenters the map imperatively when position changes via search/details
function MapController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 13), { animate: true });
  }, [position?.[0], position?.[1]]);
  return null;
}

// Lets the user click anywhere on the map to move the pin
function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * LocationPicker
 * - Search box (Google Places autocomplete via backend proxy)
 * - Interactive Leaflet/OSM map with a draggable pin
 * - On select/drag/click → reverse geocode → calls onLocationChange with full address parts
 */
const LocationPicker = ({ value, onLocationChange }) => {
  const lat = parseFloat(value?.latitude) || null;
  const lng = parseFloat(value?.longitude) || null;
  const position = lat && lng ? [lat, lng] : null;

  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  // Debounced autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) {
      setPredictions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await trStaysService.placesAutocomplete(query.trim());
        setPredictions(res.data?.predictions || []);
        setShowDropdown(true);
      } catch (e) {
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const applyDetails = useCallback((d) => {
    onLocationChange({
      latitude: d.latitude,
      longitude: d.longitude,
      address: d.address ?? value?.address ?? '',
      city: d.city ?? value?.city ?? '',
      state: d.state ?? value?.state ?? '',
      country: d.country ?? value?.country ?? '',
      postcode: d.postcode ?? value?.postcode ?? '',
    });
  }, [onLocationChange, value]);

  const handleSelectPrediction = async (p) => {
    setShowDropdown(false);
    setQuery(p.mainText);
    setResolving(true);
    try {
      const res = await trStaysService.placeDetails(p.placeId);
      if (res.data?.success) applyDetails(res.data.data);
    } catch (e) {
      // ignore — keep current fields
    } finally {
      setResolving(false);
    }
  };

  // Reverse-geocode when the pin is dragged or the map is clicked
  const handlePinMove = useCallback(async (newLat, newLng) => {
    setResolving(true);
    // Update coords immediately for snappy UX; address fills after geocode
    onLocationChange({ ...value, latitude: newLat, longitude: newLng });
    try {
      const res = await trStaysService.reverseGeocode(newLat, newLng);
      if (res.data?.success) applyDetails(res.data.data);
    } catch (e) {
      // keep coords even if reverse geocode fails
    } finally {
      setResolving(false);
    }
  }, [applyDetails, onLocationChange, value]);

  const markerEventHandlers = {
    dragend(e) {
      const { lat: dLat, lng: dLng } = e.target.getLatLng();
      handlePinMove(dLat, dLng);
    },
  };

  return (
    <div className="space-y-3">
      {/* Search box */}
      <div className="relative" ref={boxRef}>
        <div className="relative">
          {searching || resolving ? (
            <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 animate-spin" />
          ) : (
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => predictions.length > 0 && setShowDropdown(true)}
            placeholder="Search for the property location..."
            className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 outline-none transition-all bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setPredictions([]); setShowDropdown(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Predictions dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div className="absolute z-[1000] mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
            {predictions.map((p) => (
              <button
                key={p.placeId}
                type="button"
                onClick={() => handleSelectPrediction(p)}
                className="w-full flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{p.mainText}</p>
                  {p.secondaryText && (
                    <p className="text-xs text-gray-400 truncate">{p.secondaryText}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200" style={{ height: 260 }}>
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={position ? 14 : 4}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController position={position} />
          <MapClickHandler onPick={handlePinMove} />
          {position && (
            <Marker
              position={position}
              draggable
              eventHandlers={markerEventHandlers}
              icon={markerIcon}
            />
          )}
        </MapContainer>

        {/* Helper hint */}
        <div className="absolute bottom-2 left-2 right-2 z-[500] pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg shadow-sm text-[11px] text-gray-600">
            <Crosshair className="w-3 h-3 text-orange-500" />
            {position ? 'Drag the pin or tap the map to fine-tune' : 'Search above or tap the map to drop a pin'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;

'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

export interface MarkerData {
    id: string;
    type: 'lost' | 'sighting' | 'protected';
    name: string;
    species: string;
    color?: string;
    size?: string;
    lat: number;
    lng: number;
    location: string;
    date: string;
}

export interface MapViewProps {
    markers: MarkerData[];
    onMarkerClick?: (marker: MarkerData) => void;
    center?: [number, number];
    radiusKm?: number;
    onMapClick?: (lat: number, lng: number) => void;
    isSelectingLocation?: boolean;
}

// カスタムアイコン
const createIcon = (type: string) => {
    const colors: Record<string, string> = {
        lost: '#f59e0b',
        sighting: '#3b82f6',
        protected: '#10b981',
    };

    const color = colors[type] || colors.lost;

    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  `;

    return new Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// マップ中心を変更するコンポーネント
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// 地図クリックイベントを処理するコンポーネント
function MapClickHandler({ onMapClick, isSelectingLocation }: {
    onMapClick?: (lat: number, lng: number) => void;
    isSelectingLocation?: boolean;
}) {
    useMapEvents({
        click(e) {
            if (isSelectingLocation && onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

// 半径からズームレベルを計算
function getZoomForRadius(radiusKm: number): number {
    if (radiusKm <= 1) return 14;
    if (radiusKm <= 2) return 13;
    if (radiusKm <= 5) return 12;
    if (radiusKm <= 10) return 11;
    if (radiusKm <= 20) return 10;
    if (radiusKm <= 50) return 9;
    return 8;
}

export default function MapView({
    markers,
    onMarkerClick,
    center,
    radiusKm,
    onMapClick,
    isSelectingLocation
}: MapViewProps) {
    // 東京周辺をデフォルト中心に
    const defaultCenter: LatLngExpression = [35.6762, 139.6503];
    const defaultZoom = 12;

    const mapCenter: LatLngExpression = center || defaultCenter;
    const mapZoom = radiusKm ? getZoomForRadius(radiusKm) : defaultZoom;

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{
                height: '100%',
                width: '100%',
                cursor: isSelectingLocation ? 'crosshair' : 'grab'
            }}
            scrollWheelZoom={true}
        >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <MapClickHandler onMapClick={onMapClick} isSelectingLocation={isSelectingLocation} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 検索範囲を示す円 */}
            {center && radiusKm && (
                <Circle
                    center={center}
                    radius={radiusKm * 1000}
                    pathOptions={{
                        color: '#ff6b35',
                        fillColor: '#ff6b35',
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 10',
                    }}
                />
            )}

            {/* 中心マーカー */}
            {center && radiusKm && (
                <Marker
                    position={center}
                    icon={new Icon({
                        iconUrl: `data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="8" fill="#ff6b35" stroke="white" stroke-width="2"/>
                            </svg>
                        `)}`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                    })}
                >
                    <Popup>検索の中心点</Popup>
                </Marker>
            )}

            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={createIcon(marker.type)}
                    eventHandlers={{
                        click: () => onMarkerClick?.(marker),
                    }}
                >
                    <Popup>
                        <div style={{ minWidth: '150px' }}>
                            <strong>{marker.name}</strong>
                            <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>
                                {marker.species}
                                {marker.color && ` / ${marker.color}`}
                                {marker.size && ` / ${marker.size}`}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
                                📍 {marker.location}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

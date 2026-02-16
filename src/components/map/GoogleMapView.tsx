'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

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

export interface GoogleMapViewProps {
    markers: MarkerData[];
    onMarkerClick?: (marker: MarkerData) => void;
    center?: [number, number];
    radiusKm?: number;
    onMapClick?: (lat: number, lng: number) => void;
    isSelectingLocation?: boolean;
}

// マーカーの色
const markerColors: Record<string, string> = {
    lost: '#f59e0b',
    sighting: '#3b82f6',
    protected: '#10b981',
};

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

// SVGマーカーアイコンを作成
function createMarkerIcon(type: string): string {
    const color = markerColors[type] || markerColors.lost;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const containerStyle = {
    width: '100%',
    height: '100%',
};

export default function GoogleMapView({
    markers,
    onMarkerClick,
    center,
    radiusKm,
    onMapClick,
    isSelectingLocation,
}: GoogleMapViewProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        language: 'ja',
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);

    // デフォルト設定
    const defaultCenter = { lat: 35.6762, lng: 139.6503 }; // 東京
    const defaultZoom = 12;

    const mapCenter = center
        ? { lat: center[0], lng: center[1] }
        : defaultCenter;
    const mapZoom = radiusKm ? getZoomForRadius(radiusKm) : defaultZoom;

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // 地図クリック時の処理
    const handleMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (isSelectingLocation && onMapClick && e.latLng) {
                onMapClick(e.latLng.lat(), e.latLng.lng());
            }
        },
        [isSelectingLocation, onMapClick]
    );

    // 円の管理をuseEffectで行う
    useEffect(() => {
        if (!map) return;

        // 既存の円を削除
        if (circleRef.current) {
            circleRef.current.setMap(null);
            circleRef.current = null;
        }

        // 新しい円を作成
        if (center && radiusKm) {
            circleRef.current = new google.maps.Circle({
                map: map,
                center: { lat: center[0], lng: center[1] },
                radius: radiusKm * 1000,
                strokeColor: '#ff6b35',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#ff6b35',
                fillOpacity: 0.1,
                clickable: false,
            });
        }

        // クリーンアップ
        return () => {
            if (circleRef.current) {
                circleRef.current.setMap(null);
                circleRef.current = null;
            }
        };
    }, [map, center, radiusKm]);

    // 中心位置が変更されたときにマップを更新
    useEffect(() => {
        if (map && center) {
            map.panTo({ lat: center[0], lng: center[1] });
        }
    }, [map, center]);

    if (loadError) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', background: 'var(--neutral-100)',
                flexDirection: 'column', gap: '0.75rem',
            }}>
                <span style={{ fontSize: '2rem' }}>⚠️</span>
                <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>地図の読み込みに失敗しました</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%)',
                flexDirection: 'column', gap: '0.75rem',
            }}>
                <div style={{
                    width: '48px', height: '48px',
                    border: '3px solid var(--neutral-200)',
                    borderTopColor: 'var(--primary-500)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', fontWeight: 500 }}>
                    地図を読み込み中...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                ...containerStyle,
                cursor: isSelectingLocation ? 'crosshair' : 'grab',
            }}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
            }}
        >
            {/* 円はuseEffectで管理 */}

            {/* 中心マーカー */}
            {center && radiusKm && (
                <Marker
                    position={{ lat: center[0], lng: center[1] }}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#ff6b35',
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 2,
                    }}
                    title="検索の中心点"
                />
            )}

            {/* ペット・目撃情報マーカー */}
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    icon={{
                        url: createMarkerIcon(marker.type),
                        scaledSize: new google.maps.Size(32, 32),
                        anchor: new google.maps.Point(16, 32),
                    }}
                    onClick={() => {
                        setSelectedMarker(marker);
                        onMarkerClick?.(marker);
                    }}
                />
            ))}

            {/* 情報ウィンドウ */}
            {selectedMarker && (
                <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div style={{ minWidth: '150px' }}>
                        <strong>{selectedMarker.name}</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#666' }}>
                            {selectedMarker.species}
                            {selectedMarker.color && ` / ${selectedMarker.color}`}
                            {selectedMarker.size && ` / ${selectedMarker.size}`}
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
                            📍 {selectedMarker.location}
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

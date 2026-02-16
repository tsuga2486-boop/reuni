import { NextRequest, NextResponse } from 'next/server';

// Google Geocoding APIを使用した逆ジオコーディング
async function reverseGeocodeGoogle(lat: number, lng: number): Promise<string | null> {
    // サーバーサイドでは環境変数を直接使用（NEXT_PUBLIC_ プレフィックス不要）
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('Google Maps APIキーが設定されていません');
        return null;
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ja&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            return data.results[0].formatted_address;
        }

        console.warn('Google Geocoding API:', data.status, data.error_message || '');
        return null;
    } catch (error) {
        console.error('Google Geocoding APIエラー:', error);
        return null;
    }
}

// Nominatim APIを使用した逆ジオコーディング（フォールバック用）
async function reverseGeocodeNominatim(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ja&addressdetails=1&zoom=18`,
            {
                headers: {
                    'User-Agent': 'REUNI/1.0 (https://reuni.jp)',
                },
            }
        );
        const data = await response.json();

        if (data.address) {
            const addr = data.address;
            const parts: string[] = [];

            if (addr.postcode) {
                let postcode = addr.postcode.replace(/[^\d]/g, '');
                if (postcode.length === 7) {
                    postcode = postcode.slice(0, 3) + '-' + postcode.slice(3);
                }
                parts.push(`〒${postcode}`);
            }

            const prefecture = addr.state || addr.province || '';
            if (prefecture) parts.push(prefecture);

            const city = addr.city || addr.town || addr.village || addr.municipality || '';
            if (city && city !== prefecture) parts.push(city);

            const ward = addr.city_district || addr.suburb || addr.district || '';
            if (ward && ward !== city && ward !== prefecture) parts.push(ward);

            const neighbourhood = addr.neighbourhood || addr.quarter || '';
            if (neighbourhood) parts.push(neighbourhood);

            const road = addr.road || '';
            if (road && road !== neighbourhood) parts.push(road);

            if (addr.house_number) parts.push(addr.house_number);

            if (parts.length > 0) {
                const hasPostcode = parts[0]?.startsWith('〒');
                if (hasPostcode) {
                    const postcode = parts.shift();
                    return postcode + ' ' + parts.join('');
                }
                return parts.join('');
            }
        }

        return data.display_name || `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`;
    } catch (error) {
        console.error('Nominatim APIエラー:', error);
        return `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`;
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'lat and lng parameters are required' },
            { status: 400 }
        );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
            { error: 'Invalid lat or lng values' },
            { status: 400 }
        );
    }

    // まずGoogle APIを試す
    const googleResult = await reverseGeocodeGoogle(latitude, longitude);
    if (googleResult) {
        return NextResponse.json({
            address: googleResult,
            source: 'google',
        });
    }

    // Google APIが使えない場合はNominatimを使用
    const nominatimResult = await reverseGeocodeNominatim(latitude, longitude);
    return NextResponse.json({
        address: nominatimResult,
        source: 'nominatim',
    });
}

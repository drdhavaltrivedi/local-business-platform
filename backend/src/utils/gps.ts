import { getDistance } from 'geolib';
import { GPSValidationResult } from '../../../shared/types';

export function validateGPSLocation(
  customerLat: number,
  customerLon: number,
  merchantLat: number,
  merchantLon: number,
  radiusMeters: number = 100
): GPSValidationResult {
  const distance = getDistance(
    { latitude: customerLat, longitude: customerLon },
    { latitude: merchantLat, longitude: merchantLon }
  );

  if (distance <= radiusMeters) {
    return {
      isValid: true,
      distance,
      message: `Location validated. Distance: ${distance}m`,
    };
  }

  return {
    isValid: false,
    distance,
    message: `Location too far. Distance: ${distance}m, Required: ${radiusMeters}m`,
  };
}

export function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


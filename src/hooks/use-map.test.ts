import { renderHook } from '@testing-library/react';
import useMap from './use-map';
import { makeFakeCity } from '../utils/mocks';
import { Map, TileLayer } from 'leaflet';
import { vi } from 'vitest';

const mockCity = makeFakeCity();
const mockMapRef = { current: document.createElement('div') };

const mockMapInstance = {
  setView: vi.fn(),
  addLayer: vi.fn(),
};

vi.mock('leaflet', () => ({
  Map: vi.fn(() => mockMapInstance),
  TileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  Icon: vi.fn(),
  Marker: vi.fn(() => ({
    setIcon: vi.fn().mockReturnThis(),
    addTo: vi.fn(),
  })),
  layerGroup: vi.fn(() => ({
    addTo: vi.fn(),
    clearLayers: vi.fn(),
  })),
}));

describe('Hook: useMap', () => {
  it('should return a map instance', () => {
    const { result } = renderHook(() => useMap(mockMapRef, mockCity));

    expect(result.current).not.toBeNull();
    expect(Map).toHaveBeenCalledWith(mockMapRef.current, {
      center: {
        lat: mockCity.location.latitude,
        lng: mockCity.location.longitude,
      },
      zoom: mockCity.location.zoom,
    });
    expect(TileLayer).toHaveBeenCalled();
  });

  it('should call setView when city changes', () => {
    const { rerender } = renderHook(({ city }) => useMap(mockMapRef, city), {
      initialProps: { city: mockCity },
    });

    const newCity = {
      ...mockCity,
      name: 'Paris',
      location: { ...mockCity.location, latitude: 48.8566, longitude: 2.3522 },
    };

    rerender({ city: newCity });

    expect(mockMapInstance.setView).toHaveBeenCalledWith(
      {
        lat: newCity.location.latitude,
        lng: newCity.location.longitude,
      },
      newCity.location.zoom
    );
  });
});

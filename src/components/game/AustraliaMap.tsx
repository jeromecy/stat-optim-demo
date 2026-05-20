'use client';

import { geoMercator } from 'd3-geo';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// World atlas TopoJSON — served from jsDelivr CDN (stable, no API key needed)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Australia ISO 3166-1 numeric code
const AUSTRALIA_ID = '036';

// SVG canvas dimensions — ComposableMap renders a <svg> at these logical dimensions,
// then we scale it to 100% width via CSS.
const MAP_W = 800;
const MAP_H = 560;
const CENTER: [number, number] = [134, -26];
const SCALE = 720;

// Pre-compute a matching d3-geo projection so we can draw <line> elements
// inside the SVG using projected pixel coordinates (no MapContext needed).
const proj = geoMercator()
  .center(CENTER)
  .scale(SCALE)
  .rotate([0, 0, 0])
  .translate([MAP_W / 2, MAP_H / 2]);

function costColor(cost: number): string {
  const norm = Math.min(1, Math.max(0, (cost - 0.65) / 0.75));
  const r = Math.round(14 + norm * 225);
  const g = Math.round(184 - norm * 116);
  const b = Math.round(166 - norm * 166);
  return `rgb(${r},${g},${b})`;
}

export interface MapRegion {
  key: string;
  demand: number;
  transportCost: number;
  coordinates: [number, number];
  color: string;
}

interface Props {
  regions: MapRegion[];
  hubCoordinates: [number, number];
}

export default function AustraliaMap({ regions, hubCoordinates }: Props) {
  const hubPt = proj(hubCoordinates);
  if (!hubPt) return null;

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: CENTER, scale: SCALE }}
      width={MAP_W}
      height={MAP_H}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Australia landmass from Natural Earth / world-atlas */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter((geo) => String(geo.id) === AUSTRALIA_ID)
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(30,58,138,0.40)"
                stroke="rgba(148,163,184,0.55)"
                strokeWidth={0.8}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
        }
      </Geographies>

      {/* Transport lines — drawn before markers so dots sit on top.
           Skip any region whose projected position is essentially the hub itself. */}
      {regions.map((r) => {
        const cityPt = proj(r.coordinates);
        if (!cityPt) return null;
        const dx = cityPt[0] - hubPt[0];
        const dy = cityPt[1] - hubPt[1];
        if (Math.sqrt(dx * dx + dy * dy) < 8) return null; // hub city — no self-line
        return (
          <line
            key={`line-${r.key}`}
            x1={hubPt[0]}
            y1={hubPt[1]}
            x2={cityPt[0]}
            y2={cityPt[1]}
            stroke={costColor(r.transportCost)}
            strokeWidth={2}
            strokeOpacity={0.75}
            strokeDasharray={r.transportCost > 1.0 ? '10 5' : undefined}
          />
        );
      })}

      {/* Hub — Sydney warehouse */}
      <Marker coordinates={hubCoordinates}>
        <circle r={7} fill="rgba(245,158,11,0.95)" />
        <circle r={11} fill="none" stroke="rgba(245,158,11,0.35)" strokeWidth={2} />
        <text
          textAnchor="start"
          x={14}
          y={5}
          style={{ fontSize: 11, fontWeight: 700, fill: '#1e3a8a', fontFamily: 'sans-serif' }}
        >
          Hub (Sydney)
        </text>
      </Marker>

      {/* City markers — size proportional to demand */}
      {regions.map((r) => {
        const radius = Math.max(5, Math.sqrt(r.demand) * 0.65);
        return (
          <Marker key={r.key} coordinates={r.coordinates}>
            <circle r={radius} fill={r.color} fillOpacity={0.9} />
            <text
              textAnchor="middle"
              y={-(radius + 4)}
              style={{ fontSize: 11, fontWeight: 700, fill: '#1e3a8a', fontFamily: 'sans-serif' }}
            >
              {r.key}
            </text>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}

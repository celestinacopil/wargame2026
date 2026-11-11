/* VesselTrace: fictional ship database for Darsenia challenge 02.
   All vessels, companies, IMO/MMSI numbers and positions are invented for the wargame.

   Answer design (organisers only):
   - The informant's photos show part of a name ("SEA...") on 2 Dec 2026 around 21:10 UTC.
   - Players look up AURORA to get its position at that time (72°41.0'N 033°52.4'E).
   - Only SEASTAR (IMO 9473822) was within a few nautical miles of the Aurora at 21:10 on 2 Dec.
   - Decoys: SEASTAR II was at the same spot, but on 28 Nov (wrong date). SEA STARLING was in the
     same region but ~50 nm away. SEAFALCON is the same ship type but was moored in Vardos.
   - Supporting clue: SEASTAR stopped transmitting AIS from 21:38 until 08:16 the next morning.
   - SEASTAR was called NORTHLIGHT until Oct 2026. This links it to challenge 03, which names the Northlight.

   Positions: times are UTC, newest first in the page. lat/lon are decimal degrees. */
window.VESSELS = [
  {
    name: "SEASTAR", imo: "9473822", mmsi: "616999412", callsign: "D6FS7",
    flag: "Comoros", type: "Offshore Support Vessel", status: "Active",
    gt: "2,980", dwt: "3,450", loa: "71.9 m", beam: "16.0 m", draught: "5.8 m",
    built: "2009", builder: "Kestrel Yard, Vardos (Belvaria)", homeport: "Moroni",
    formerNames: ["NORTHLIGHT (2009-2026, renamed Oct 2026)"],
    livery: "Dark grey hull; white superstructure aft; orange deck crane",
    equipment: "1 × 15 t knuckle-boom deck crane (aft); A-frame on stern; moon pool",
    owner:   { name: "Belvarian Maritime Ltd.", address: "18 Port Avenue, Vardos, Belvaria", since: "Sep 2019" },
    manager: { name: "Belvarian Maritime Ltd.", address: "18 Port Avenue, Vardos, Belvaria", since: "Sep 2019" },
    ism:     { name: "Port Avenue Ship Management Ltd.", address: "18 Port Avenue, Vardos, Belvaria", since: "Mar 2020" },
    portCalls: [
      { port: "Vardos (Belvaria)", arrived: "2026-12-03 15:52", departed: "" },
      { port: "Vardos (Belvaria)", arrived: "2026-11-24 09:10", departed: "2026-12-02 14:02" },
      { port: "Harbour City (Belvaria)", arrived: "2026-11-19 07:45", departed: "2026-11-23 18:30" }
    ],
    positions: [
      { t: "2026-12-03 15:40", lat: 70.9712, lon: 30.0951, sog: 4.1, cog: 188, nav: "Underway using engine", area: "Vardos approaches" },
      { t: "2026-12-03 08:16", lat: 72.3617, lon: 33.2000, sog: 12.6, cog: 214, nav: "Underway using engine", area: "Open sea" },
      { gap: "No AIS position received for 10 h 38 min (2 Dec 21:38 to 3 Dec 08:16 UTC)" },
      { t: "2026-12-02 21:38", lat: 72.7100, lon: 34.0017, sog: 0.4, cog: 75, nav: "Underway using engine", area: "Disputed zone (survey area)" },
      { t: "2026-12-02 21:10", lat: 72.7050, lon: 33.9767, sog: 2.1, cog: 68, nav: "Underway using engine", area: "Disputed zone (survey area)" },
      { t: "2026-12-02 20:30", lat: 72.6483, lon: 33.7350, sog: 6.0, cog: 41, nav: "Underway using engine", area: "Disputed zone" },
      { t: "2026-12-02 18:40", lat: 72.3400, lon: 33.0950, sog: 11.2, cog: 32, nav: "Underway using engine", area: "Open sea" },
      { t: "2026-12-02 14:05", lat: 70.9790, lon: 30.0904, sog: 6.3, cog: 15, nav: "Underway using engine", area: "Vardos approaches" }
    ]
  },
  {
    name: "AURORA", imo: "9058177", mmsi: "263990120", callsign: "DRAU3",
    flag: "Darsenia", type: "Research / Survey Vessel", status: "Active (damaged)",
    gt: "1,840", dwt: "720", loa: "64.2 m", beam: "13.1 m", draught: "4.9 m",
    built: "1993", builder: "Halvik Shipyard (Darsenia)", homeport: "Halvik",
    formerNames: [],
    livery: "White hull with blue stripe; white superstructure forward",
    equipment: "Multibeam echo sounder; seismic survey compartment; 1 × 5 t crane",
    owner:   { name: "Darsenian Institute of Marine Geosciences", address: "2 Harbour Road, Halvik, Darsenia", since: "1993" },
    manager: { name: "Darsenian Institute of Marine Geosciences", address: "2 Harbour Road, Halvik, Darsenia", since: "1993" },
    ism:     { name: "Halvik Ship Services", address: "40 Quay Street, Halvik, Darsenia", since: "2015" },
    portCalls: [
      { port: "Halvik (Darsenia)", arrived: "2026-11-25 16:20", departed: "2026-11-28 07:00" }
    ],
    positions: [
      { t: "2026-12-03 07:30", lat: 72.6835, lon: 33.8735, sog: 0.0, cog: 0, nav: "Not under command", area: "Disputed zone (survey area)" },
      { t: "2026-12-03 06:42", lat: 72.6834, lon: 33.8733, sog: 0.0, cog: 0, nav: "Not under command", area: "Disputed zone (survey area)" },
      { t: "2026-12-03 06:30", lat: 72.6834, lon: 33.8733, sog: 0.2, cog: 0, nav: "Restricted manoeuvrability (survey)", area: "Disputed zone (survey area)" },
      { t: "2026-12-02 21:10", lat: 72.6833, lon: 33.8733, sog: 0.1, cog: 0, nav: "Restricted manoeuvrability (survey)", area: "Disputed zone (survey area)" },
      { t: "2026-12-02 15:00", lat: 72.6790, lon: 33.8610, sog: 1.8, cog: 50, nav: "Restricted manoeuvrability (survey)", area: "Disputed zone (survey area)" },
      { t: "2026-11-28 07:05", lat: 71.4200, lon: 31.2100, sog: 9.5, cog: 30, nav: "Underway using engine", area: "Halvik approaches" }
    ]
  },
  {
    name: "SEASTAR II", imo: "9287144", mmsi: "248331700", callsign: "9HSX4",
    flag: "Malta", type: "Crude Oil Tanker", status: "Active",
    gt: "61,250", dwt: "115,400", loa: "248.0 m", beam: "43.8 m", draught: "14.9 m",
    built: "2004", builder: "Ulsan Heavy Marine (South Korea)", homeport: "Valletta",
    formerNames: ["ARCTIC PRIDE (2004-2016)"],
    livery: "Red hull; white accommodation aft",
    equipment: "2 × 15 t hose-handling cranes (midship)",
    owner:   { name: "Arcturus Tankers Ltd.", address: "Triq il-Port, Valletta, Malta", since: "2016" },
    manager: { name: "Arcturus Tankers Ltd.", address: "Triq il-Port, Valletta, Malta", since: "2016" },
    ism:     { name: "Meridian Tanker Services", address: "Limassol, Cyprus", since: "2019" },
    portCalls: [
      { port: "Vardos (Belvaria)", arrived: "2026-11-26 10:00", departed: "2026-11-27 22:15" }
    ],
    positions: [
      { t: "2026-12-02 21:10", lat: 71.3300, lon: 24.5000, sog: 12.4, cog: 262, nav: "Underway using engine", area: "Open sea (westbound)" },
      { t: "2026-11-30 09:00", lat: 72.1000, lon: 29.4000, sog: 12.1, cog: 255, nav: "Underway using engine", area: "Open sea" },
      { t: "2026-11-28 21:10", lat: 72.6800, lon: 33.8317, sog: 11.8, cog: 48, nav: "Underway using engine", area: "Disputed zone" },
      { t: "2026-11-28 16:00", lat: 72.2000, lon: 32.6000, sog: 12.0, cog: 40, nav: "Underway using engine", area: "Open sea" }
    ]
  },
  {
    name: "SEA STARLING", imo: "9630511", mmsi: "263114800", callsign: "DRSL2",
    flag: "Darsenia", type: "Fishing Vessel (Stern Trawler)", status: "Active",
    gt: "1,120", dwt: "640", loa: "48.5 m", beam: "11.2 m", draught: "5.1 m",
    built: "2014", builder: "Halvik Shipyard (Darsenia)", homeport: "Halvik",
    formerNames: [],
    livery: "Dark blue hull; white wheelhouse forward",
    equipment: "Trawl gantry (stern); net drums",
    owner:   { name: "Halvik Fishermen's Cooperative", address: "7 Net Lane, Halvik, Darsenia", since: "2014" },
    manager: { name: "Halvik Fishermen's Cooperative", address: "7 Net Lane, Halvik, Darsenia", since: "2014" },
    ism:     { name: "Halvik Ship Services", address: "40 Quay Street, Halvik, Darsenia", since: "2018" },
    portCalls: [
      { port: "Halvik (Darsenia)", arrived: "2026-11-27 13:00", departed: "2026-11-30 05:40" }
    ],
    positions: [
      { t: "2026-12-03 06:40", lat: 72.1200, lon: 31.9000, sog: 3.2, cog: 140, nav: "Engaged in fishing", area: "Northern fishing grounds" },
      { t: "2026-12-02 21:10", lat: 72.0833, lon: 31.6667, sog: 3.5, cog: 120, nav: "Engaged in fishing", area: "Northern fishing grounds" },
      { t: "2026-12-02 09:00", lat: 72.0400, lon: 31.4000, sog: 3.1, cog: 95, nav: "Engaged in fishing", area: "Northern fishing grounds" }
    ]
  },
  {
    name: "SEAFALCON", imo: "9174282", mmsi: "277402500", callsign: "BVSF1",
    flag: "Belvaria", type: "Offshore Support Vessel", status: "Active",
    gt: "2,610", dwt: "3,100", loa: "68.0 m", beam: "15.5 m", draught: "5.6 m",
    built: "1999", builder: "Kestrel Yard, Vardos (Belvaria)", homeport: "Vardos",
    formerNames: [],
    livery: "Dark grey hull; white superstructure forward; yellow deck crane",
    equipment: "1 × 10 t deck crane (forward); towing winch",
    owner:   { name: "Vardos Offshore Services Ltd.", address: "3 Dock Road, Vardos, Belvaria", since: "1999" },
    manager: { name: "Vardos Offshore Services Ltd.", address: "3 Dock Road, Vardos, Belvaria", since: "1999" },
    ism:     { name: "Vardos Offshore Services Ltd.", address: "3 Dock Road, Vardos, Belvaria", since: "2008" },
    portCalls: [
      { port: "Vardos (Belvaria)", arrived: "2026-11-29 12:10", departed: "2026-12-05 08:00" }
    ],
    positions: [
      { t: "2026-12-03 06:40", lat: 70.9745, lon: 30.0810, sog: 0.0, cog: 0, nav: "Moored", area: "Port of Vardos" },
      { t: "2026-12-02 21:10", lat: 70.9745, lon: 30.0810, sog: 0.0, cog: 0, nav: "Moored", area: "Port of Vardos" },
      { t: "2026-11-29 12:10", lat: 70.9745, lon: 30.0810, sog: 0.0, cog: 0, nav: "Moored", area: "Port of Vardos" }
    ]
  }
];

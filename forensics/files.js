/* Fake evidence files for the forensic terminal (Darsenia challenge 05: "What the satellite saw").
   The terminal reads the metadata below. The key image also exists as a real file with the same
   metadata: challenges/darsenia/evidence/ISB2_SAR_20261202T211014.jpg (players with a real
   exiftool get the same answer).

   Answer design (organisers only):
   - Story: ISBRYN-2 is a civilian radar satellite run by a shady commercial operator
     (Nordaurel Space Imaging) that also sells a store-and-forward messaging service. Belvaria used
     it to relay encrypted commands to SEASTAR during the black-ops sabotage, to hide state
     involvement. Darsenian intelligence got hold of image files the satellite downlinked (how is
     not disclosed). Placing the satellite above the area at 21:10 ties it to the operation; its
     message log is a possible lead for a later challenge.
   - It is polar night at 72.7 N in December, so only a radar (SAR) satellite can image the ships.
   - ISB2_SAR_20261202T211014.jpg is the key image: taken 2026:12:02 21:10:14 UTC, the time of the
     source's account in challenge 03. Camera Make = operator (Nordaurel Space Imaging),
     Model = satellite name (ISBRYN-2). The name is NOT part of the flag.
   - Its GPS tags record where the SATELLITE was: 72.0137 N, 25.4862 E, 524 km up
     (72 deg 0' 49.32" N, 25 deg 29' 10.32" E). The satellite looks sideways (right-looking,
     ascending pass, look direction 75 deg), so it was ~300 km WSW of the ships, well within
     radio range of them.
   - The Image Description gives the scene centre (72.6940 N, 33.9250 E). That is the trap: it is
     where the picture is, not where the satellite was. The two bright dots in the real image sit
     at the AIS positions of AURORA and SEASTAR at 21:10 (vesseltrace/catalog.js).
   - Flag: FLAG{72.01,25.49} (a space after the comma is also accepted).
   - Decoy: ISB2_SAR_20261202T094207.jpg is the same satellite's morning pass (09:42 UTC,
     descending, satellite at 72.3118 N, 42.4706 E). SEASTAR was still in port then.
   - ISB2_SAR_20261202T211014_web.jpg is a resized copy that was forwarded around: its metadata
     was stripped.

   Each tag: g = group (as shown by exiftool -G), k = tag name (exiftool -s), d = description
   (default output), v = printed value, n = value with -n (defaults to v). GPS tags are built below. */
(() => {
  const OPERATOR = "Nordaurel Space Imaging";
  const SATELLITE = "ISBRYN-2";

  // Product tags written by the satellite operator's ground processor.
  const product = (time, pass, sceneLat, sceneLon) => [
    ["EXIF", "ImageDescription", "Image Description",
      SATELLITE + " radar (SAR) image, C-band, Stripmap mode, " + pass + " pass, right-looking. " +
      "Scene centre " + sceneLat + "N " + sceneLon + "E. Pixel spacing 10 m. " +
      "GPS tags record the satellite position at acquisition."],
    ["EXIF", "Make", "Make", OPERATOR],
    ["EXIF", "Model", "Camera Model Name", SATELLITE],
    ["EXIF", "Software", "Software", "NSI SAR Processor 3.1"],
    ["EXIF", "Artist", "Artist", OPERATOR + ", ground segment"],
    ["EXIF", "Copyright", "Copyright", "(c) 2026 " + OPERATOR + ". All rights reserved."],
    ["EXIF", "DateTimeOriginal", "Date/Time Original", time],
    ["EXIF", "CreateDate", "Create Date", time],
    ["EXIF", "OffsetTimeOriginal", "Offset Time Original", "+00:00"]
  ];

  // 72.0137 -> 72 deg 0' 49.32" (exiftool's default format)
  function dms(value) {
    const a = Math.abs(value);
    const deg = Math.floor(a);
    const minFull = (a - deg) * 60;
    const min = Math.floor(minFull);
    const sec = ((minFull - min) * 60).toFixed(2).replace(/\.?0+$/, "");
    return deg + " deg " + min + "' " + sec + '"';
  }

  function gps(lat, lon, date, time, direction, altitude) {
    const latRef = lat >= 0 ? "N" : "S", lonRef = lon >= 0 ? "E" : "W";
    return [
      ["GPS", "GPSVersionID", "GPS Version ID", "2.3.0.0", "2 3 0 0"],
      ["GPS", "GPSLatitudeRef", "GPS Latitude Ref", lat >= 0 ? "North" : "South", latRef],
      ["GPS", "GPSLatitude", "GPS Latitude", dms(lat), String(Math.abs(lat)), Math.abs(lat)],
      ["GPS", "GPSLongitudeRef", "GPS Longitude Ref", lon >= 0 ? "East" : "West", lonRef],
      ["GPS", "GPSLongitude", "GPS Longitude", dms(lon), String(Math.abs(lon)), Math.abs(lon)],
      ["GPS", "GPSAltitudeRef", "GPS Altitude Ref", "Above Sea Level", "0"],
      ["GPS", "GPSAltitude", "GPS Altitude", altitude + " m", String(altitude)],
      ["GPS", "GPSTimeStamp", "GPS Time Stamp", time],
      ["GPS", "GPSImgDirectionRef", "GPS Img Direction Ref", "True North", "T"],
      ["GPS", "GPSImgDirection", "GPS Img Direction", String(direction)],
      ["GPS", "GPSMapDatum", "GPS Map Datum", "WGS-84"],
      ["GPS", "GPSDateStamp", "GPS Date Stamp", date],
      ["Composite", "GPSAltitude", "GPS Altitude", altitude + " m Above Sea Level", String(altitude)],
      ["Composite", "GPSDateTime", "GPS Date/Time", date + " " + time + "Z"],
      ["Composite", "GPSLatitude", "GPS Latitude", dms(lat) + " " + latRef, String(lat), lat],
      ["Composite", "GPSLongitude", "GPS Longitude", dms(lon) + " " + lonRef, String(lon), lon],
      ["Composite", "GPSPosition", "GPS Position", dms(lat) + " " + latRef + ", " + dms(lon) + " " + lonRef, lat + " " + lon]
    ];
  }

  const fileTags = (name, size, bytes, modified, type) => [
    ["ExifTool", "ExifToolVersion", "ExifTool Version Number", "12.76"],
    ["System", "FileName", "File Name", name],
    ["System", "Directory", "Directory", "{dir}"],
    ["System", "FileSize", "File Size", size, String(bytes)],
    ["System", "FileModifyDate", "File Modification Date/Time", modified],
    ["System", "FilePermissions", "File Permissions", "-rw-r--r--", "100644"],
    ["File", "FileType", "File Type", type],
    ["File", "FileTypeExtension", "File Type Extension", type === "JPEG" ? "jpg" : "txt"],
    ["File", "MIMEType", "MIME Type", type === "JPEG" ? "image/jpeg" : "text/plain"]
  ];

  // Radar images are greyscale: one colour component.
  const image = (w, h) => [
    ["File", "ImageWidth", "Image Width", String(w)],
    ["File", "ImageHeight", "Image Height", String(h)],
    ["File", "EncodingProcess", "Encoding Process", "Baseline DCT, Huffman coding", "0"],
    ["File", "BitsPerSample", "Bits Per Sample", "8"],
    ["File", "ColorComponents", "Color Components", "1"]
  ];

  const composite = (w, h) => [
    ["Composite", "ImageSize", "Image Size", w + "x" + h, w + " " + h],
    ["Composite", "Megapixels", "Megapixels", (w * h / 1e6).toFixed(1)]
  ];

  const tag = ([g, k, d, v, n, num]) => ({ g, k, d, v, n: n ?? v, num });

  // What the Linux `file` command prints for each image.
  const magicExif = w => "JPEG image data, Exif standard: [TIFF image data, big-endian, direntries=9, manufacturer=" +
    OPERATOR + ", model=" + SATELLITE + ", software=NSI SAR Processor 3.1], baseline, precision 8, " + w + "x" + w + ", components 1";

  window.EVIDENCE = {
    files: [
      {
        name: "ISB2_SAR_20261202T094207.jpg", type: "jpeg", size: "618 kB", bytes: 632911, date: "Dec  4 16:31",
        magic: magicExif(1000),
        tags: [
          ...fileTags("ISB2_SAR_20261202T094207.jpg", "618 kB", 632911, "2026:12:04 16:31:08+00:00", "JPEG"),
          ...image(1000, 1000), ...product("2026:12:02 09:42:07", "descending", "72.6930", "33.9010"),
          ...gps(72.3118, 42.4706, "2026:12:02", "09:42:07", 285, 524100),
          ...composite(1000, 1000)
        ].map(tag)
      },
      {
        name: "ISB2_SAR_20261202T211014.jpg", type: "jpeg", size: "617 kB", bytes: 631518, date: "Dec  4 16:31",
        magic: magicExif(1000),
        tags: [
          ...fileTags("ISB2_SAR_20261202T211014.jpg", "617 kB", 631518, "2026:12:04 16:31:09+00:00", "JPEG"),
          ...image(1000, 1000), ...product("2026:12:02 21:10:14", "ascending", "72.6940", "33.9250"),
          ...gps(72.0137, 25.4862, "2026:12:02", "21:10:14", 75, 524300),
          ...composite(1000, 1000)
        ].map(tag)
      },
      {
        name: "ISB2_SAR_20261202T211014_web.jpg", type: "jpeg", size: "188 kB", bytes: 192514, date: "Dec  4 14:05",
        magic: "JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, comment: \"Resized for sharing\", baseline, precision 8, 800x800, components 1",
        tags: [
          ...fileTags("ISB2_SAR_20261202T211014_web.jpg", "188 kB", 192514, "2026:12:04 14:05:40+00:00", "JPEG"),
          ["File", "Comment", "Comment", "Resized for sharing"],
          ...image(800, 800),
          ["JFIF", "JFIFVersion", "JFIF Version", "1.01", "1 1"],
          ["JFIF", "ResolutionUnit", "Resolution Unit", "None", "0"],
          ["JFIF", "XResolution", "X Resolution", "1"],
          ["JFIF", "YResolution", "Y Resolution", "1"],
          ...composite(800, 800)
        ].map(tag)
      },
      {
        name: "evidence_note.txt", type: "text", size: "720 bytes", bytes: 720, date: "Dec  4 16:40",
        tags: [
          ...fileTags("evidence_note.txt", "720 bytes", 720, "2026:12:04 16:40:12+00:00", "TXT"),
          ["File", "MIMEEncoding", "MIME Encoding", "us-ascii"],
          ["File", "Newlines", "Newlines", "Unix LF", "\\n"],
          ["File", "LineCount", "Line Count", "16"],
          ["File", "WordCount", "Word Count", "109"]
        ].map(tag),
        text: [
          "DARSENIA INTELLIGENCE COMMAND - EVIDENCE NOTE",
          "Ref: 7731-HUM-2026-114 / SIGINT-02     Classification: SECRET II",
          "",
          "These image files were downlinked by a civilian radar satellite",
          "on 2 DEC 2026. We obtained them on 04 DEC. How is not disclosed.",
          "",
          "We believe Belvaria rents this satellite's messaging service to",
          "send encrypted commands to its ships, hiding behind a private",
          "company. Identify the satellite and place it at the time of the",
          "source's account (2 DEC, around 21:10 UTC).",
          "",
          "ISB2_SAR_*.jpg     image files as downlinked by the satellite.",
          "*_web.jpg          smaller copy that was forwarded around first.",
          "",
          "Analysts: use exiftool. Type 'help' if you are new to the terminal.",
          "-- SIGINT Desk, Darsenia Intelligence Command",
          ""
        ].join("\n")
      }
    ]
  };
})();

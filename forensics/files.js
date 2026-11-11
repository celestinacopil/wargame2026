/* Fake evidence files for the forensic terminal (Darsenia challenge 05).
   No real image files exist: the terminal reads the metadata below.

   Answer design (organisers only):
   - IMG_20261202_210947.jpg is the key photo. Its GPS position is 72.7024 N, 33.9712 E
     (72°42'8.64"N 33°58'16.32"E), taken 2026:12:02 21:09:47 UTC.
   - That is ~340 m from SEASTAR's AIS position at 21:10 (the report says "estimated range 300 m"),
     with the camera pointing at bearing 32°, towards the ship.
   - Flag: FLAG{72.70,33.97} (decimal degrees, 2 decimals). The second photo gives the same answer.
   - received_20261204_190112.jpg was re-sent through a chat app, which stripped its EXIF data.

   Each tag: g = group (as shown by exiftool -G), k = tag name (exiftool -s), d = description
   (default output), v = printed value, n = value with -n (defaults to v). GPS tags are built below. */
(() => {
  const camera = [
    ["EXIF", "Make", "Make", "Lumen"],
    ["EXIF", "Model", "Camera Model Name", "Lumen X12 Pro"],
    ["EXIF", "Orientation", "Orientation", "Horizontal (normal)", "1"],
    ["EXIF", "XResolution", "X Resolution", "72"],
    ["EXIF", "YResolution", "Y Resolution", "72"],
    ["EXIF", "ResolutionUnit", "Resolution Unit", "inches", "2"],
    ["EXIF", "Software", "Software", "X12PRO-OS 14.2"]
  ];

  const shot = (time, exposure, iso) => [
    ["EXIF", "ModifyDate", "Modify Date", time],
    ["EXIF", "ExposureTime", "Exposure Time", exposure, exposure === "1/30" ? "0.0333333333333333" : "0.05"],
    ["EXIF", "FNumber", "F Number", "1.8"],
    ["EXIF", "ISO", "ISO", iso],
    ["EXIF", "DateTimeOriginal", "Date/Time Original", time],
    ["EXIF", "CreateDate", "Create Date", time],
    ["EXIF", "OffsetTimeOriginal", "Offset Time Original", "+00:00"],
    ["EXIF", "Flash", "Flash", "Off, Did not fire", "16"],
    ["EXIF", "FocalLength", "Focal Length", "5.4 mm", "5.4"],
    ["EXIF", "ExifImageWidth", "Exif Image Width", "4000"],
    ["EXIF", "ExifImageHeight", "Exif Image Height", "3000"]
  ];

  // 72.7024 -> 72 deg 42' 8.64" (exiftool's default format)
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
      ["GPS", "GPSLatitudeRef", "GPS Latitude Ref", lat >= 0 ? "North" : "South", latRef],
      ["GPS", "GPSLatitude", "GPS Latitude", dms(lat), String(Math.abs(lat)), Math.abs(lat)],
      ["GPS", "GPSLongitudeRef", "GPS Longitude Ref", lon >= 0 ? "East" : "West", lonRef],
      ["GPS", "GPSLongitude", "GPS Longitude", dms(lon), String(Math.abs(lon)), Math.abs(lon)],
      ["GPS", "GPSAltitudeRef", "GPS Altitude Ref", "Above Sea Level", "0"],
      ["GPS", "GPSAltitude", "GPS Altitude", altitude + " m", String(altitude)],
      ["GPS", "GPSTimeStamp", "GPS Time Stamp", time],
      ["GPS", "GPSImgDirectionRef", "GPS Img Direction Ref", "True North", "T"],
      ["GPS", "GPSImgDirection", "GPS Img Direction", String(direction)],
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

  const image = (w, h) => [
    ["File", "ImageWidth", "Image Width", String(w)],
    ["File", "ImageHeight", "Image Height", String(h)],
    ["File", "EncodingProcess", "Encoding Process", "Baseline DCT, Huffman coding", "0"],
    ["File", "BitsPerSample", "Bits Per Sample", "8"],
    ["File", "ColorComponents", "Color Components", "3"]
  ];

  const composite = (w, h) => [
    ["Composite", "ImageSize", "Image Size", w + "x" + h, w + " " + h],
    ["Composite", "Megapixels", "Megapixels", (w * h / 1e6).toFixed(1)]
  ];

  const tag = ([g, k, d, v, n, num]) => ({ g, k, d, v, n: n ?? v, num });

  window.EVIDENCE = {
    files: [
      {
        name: "IMG_20261202_210947.jpg", type: "jpeg", size: "4.1 MB", bytes: 4302118, date: "Dec  4 19:02",
        tags: [
          ...fileTags("IMG_20261202_210947.jpg", "4.1 MB", 4302118, "2026:12:04 19:02:31+00:00", "JPEG"),
          ...image(4000, 3000), ...camera, ...shot("2026:12:02 21:09:47", "1/30", "1600"),
          ...gps(72.7024, 33.9712, "2026:12:02", "21:09:47", 32.2, 3.1),
          ...composite(4000, 3000)
        ].map(tag)
      },
      {
        name: "IMG_20261202_211203.jpg", type: "jpeg", size: "3.9 MB", bytes: 4087552, date: "Dec  4 19:02",
        tags: [
          ...fileTags("IMG_20261202_211203.jpg", "3.9 MB", 4087552, "2026:12:04 19:02:33+00:00", "JPEG"),
          ...image(4000, 3000), ...camera, ...shot("2026:12:02 21:12:03", "1/20", "2000"),
          ...gps(72.7026, 33.9719, "2026:12:02", "21:12:03", 30.7, 3.4),
          ...composite(4000, 3000)
        ].map(tag)
      },
      {
        name: "received_20261204_190112.jpg", type: "jpeg", size: "212 kB", bytes: 217340, date: "Dec  4 19:01",
        tags: [
          ...fileTags("received_20261204_190112.jpg", "212 kB", 217340, "2026:12:04 19:01:12+00:00", "JPEG"),
          ["File", "Comment", "Comment", "Compressed by SecureChat"],
          ...image(1600, 1200),
          ["JFIF", "JFIFVersion", "JFIF Version", "1.01", "1 1"],
          ["JFIF", "ResolutionUnit", "Resolution Unit", "None", "0"],
          ["JFIF", "XResolution", "X Resolution", "1"],
          ["JFIF", "YResolution", "Y Resolution", "1"],
          ...composite(1600, 1200)
        ].map(tag)
      },
      {
        name: "handover_note.txt", type: "text", size: "641 bytes", bytes: 641, date: "Dec  4 19:20",
        tags: [
          ...fileTags("handover_note.txt", "641 bytes", 641, "2026:12:04 19:20:05+00:00", "TXT"),
          ["File", "MIMEEncoding", "MIME Encoding", "us-ascii"],
          ["File", "Newlines", "Newlines", "Unix LF", "\\n"],
          ["File", "LineCount", "Line Count", "13"],
          ["File", "WordCount", "Word Count", "96"]
        ].map(tag),
        text: [
          "INTELLIGENCE UNIT 7731 - EVIDENCE HANDOVER NOTE",
          "Ref: 7731-HUM-2026-114            Classification: SECRET II",
          "",
          "Files copied from the source's personal mobile device on",
          "04 DEC 2026, 19:00Z, at the source meeting.",
          "",
          "IMG_20261202_*.jpg   original files, copied directly from the device.",
          "received_*.jpg       copy the source sent us earlier through the",
          "                     SecureChat app, before the meeting.",
          "",
          "Task: authenticate the photographs. Establish where and when they were",
          "taken. Analysts: use exiftool. Type 'help' if you are new to the terminal.",
          "-- CPT [REDACTED], Collection Officer"
        ].join("\n")
      }
    ]
  };
})();

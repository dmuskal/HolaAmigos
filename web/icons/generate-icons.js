// One-off icon generator: no image libs are available in this environment,
// so this renders a simple gradient-background + white-star icon directly
// to raw RGBA pixels and hand-encodes a PNG (via Node's built-in zlib).
// Run with: node generate-icons.js
// Safe to delete after icons/*.png are committed — it's a build-time tool,
// not part of the shipped app.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Add a filter-type byte (0 = none) at the start of every scanline.
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idatData = zlib.deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function lerp(a, b, t) { return a + (b - a) * t; }

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = (yi > y) !== (yj > y) &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function starPolygon(cx, cy, outerR, innerR, points = 5, rotation = -Math.PI / 2) {
  const verts = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rotation + (i * Math.PI) / points;
    verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return verts;
}

function renderIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  // Warm radial gradient background: matches the app's home-screen palette
  // (orange/yellow center fading to pink at the edges).
  const inner = [255, 176, 59];   // warm orange
  const outer = [255, 111, 165];  // playful pink

  const star = starPolygon(cx, cy, size * 0.34, size * 0.135);
  const starEdge = starPolygon(cx, cy, size * 0.355, size * 0.145); // slight outline

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const t = Math.min(1, dist * 1.15);
      let r = lerp(inner[0], outer[0], t);
      let g = lerp(inner[1], outer[1], t);
      let b = lerp(inner[2], outer[2], t);

      const px = x + 0.5, py = y + 0.5;
      if (pointInPolygon(px, py, starEdge)) {
        // Soft gold outline just outside the white star fill.
        r = 255; g = 214; b = 102;
      }
      if (pointInPolygon(px, py, star)) {
        r = 255; g = 255; b = 255;
      }

      const idx = (y * size + x) * 4;
      rgba[idx] = Math.round(r);
      rgba[idx + 1] = Math.round(g);
      rgba[idx + 2] = Math.round(b);
      rgba[idx + 3] = 255;
    }
  }
  return rgba;
}

const outDir = __dirname;
for (const size of [180, 192, 512]) {
  const rgba = renderIcon(size);
  const png = encodePNG(size, size, rgba);
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`wrote ${file} (${png.length} bytes)`);
}

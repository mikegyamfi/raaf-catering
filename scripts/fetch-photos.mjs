// Downloads the stand-in Unsplash photos and fits them to each photo slot.
// Unsplash License: free for commercial use, no attribution required (credited in README anyway).
// Replace any of these with her own photos by saving over the same file name.
import sharp from "sharp";

const slots = [
  ["owner", "1652283321082-72bb2b601abd", 1200, 1500],
  ["kitchen", "1549590143-d5855148a9d5", 1600, 1200],
  ["gallery-01", "1545668855-b923f0176935", 1200, 1500], // meat pies
  ["gallery-02", "1665332195309-9d75071138f0", 1400, 1400], // party jollof
  ["gallery-03", "1772457677598-2dc68bb6f4c8", 1600, 1200], // small chops
  ["gallery-04", "1598373182133-52452f7691ef", 1400, 1400], // butter bread
  ["gallery-05", "1664993085274-80c6ba725ccc", 1200, 1500], // bofrot
  ["gallery-06", "1692640848099-325af9b3f75f", 1400, 1400], // vanilla cake
  ["gallery-07", "1718942899999-b3da4177ee2a", 1600, 1200], // grilled tilapia
  ["gallery-08", "1767065886912-4cfb43757e36", 1200, 1500], // marble bread
  ["gallery-09", "1665554837563-3782d21a676b", 1400, 1400], // chin chin
  ["gallery-10", "1664993101841-036f189719b6", 1400, 1400], // jollof with grilled chicken
  ["gallery-11", "1606890737304-57a1ca8a5b62", 1200, 1500], // chocolate cake
  ["gallery-12", "1743012492397-c6680eaa2c5d", 1600, 1200], // sausage rolls
];

for (const [name, id, w, h] of slots) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2000&q=85&fm=jpg`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = `public/photos/REPLACE-${name}.webp`;
  const info = await sharp(buf).resize(w, h, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 78 }).toFile(out);
  console.log(out, Math.round(info.size / 1024) + "KB");
}

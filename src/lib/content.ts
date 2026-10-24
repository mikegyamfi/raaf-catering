/**
 * All of RAAF's content lives here. Edit this file to change the site.
 *
 * Everything below comes from her handwritten notes (see _source/TRANSCRIPT.md).
 * Anything she hasn't given us yet is a `{{PLACEHOLDER}}` string or `null`.
 * The UI shows a graceful fallback for those (e.g. "Price on request"), so the
 * site never displays a made-up number, address or review.
 * Search this file for "{{" to find everything that still needs filling in.
 */

import type { IllustrationName } from "@/components/illustrations";

export const isPlaceholder = (v: string | null | undefined): v is null =>
  v == null || /\{\{.+\}\}/.test(v);

/* ───────────────────────── Business ───────────────────────── */

export const business = {
  name: "RAAF",
  legalName: "RAAF Professional Catering Services",
  shortName: "RAAF catering",
  tagline: "Good food. Great moments.",
  mood: "Good food. Good mood.",
  priority: "Quality is our priority.",
  ownerName: "{{OWNER_NAME}}",
  /** Digits only, with country code, e.g. "233201234567". Powers click-to-call and WhatsApp. */
  phone: "{{PHONE}}",
  /** Usually the same as phone. Digits only with country code. */
  whatsapp: "{{WHATSAPP}}",
  email: "{{EMAIL}}",
  /** Area / city she serves from. She is home-based, so this can be general, e.g. "East Legon, Accra". */
  area: "{{AREA_CITY}}",
  /** Full street address, only if she wants it public. Used for the map. */
  address: "{{ADDRESS}}",
  country: "{{COUNTRY}}", // dishes suggest Ghana; please confirm
  currency: "{{CURRENCY}}", // e.g. "GH₵"
  siteUrl: "https://{{DOMAIN}}",
  socials: [
    { label: "Instagram", href: "{{INSTAGRAM_URL}}" },
    { label: "Facebook", href: "{{FACEBOOK_URL}}" },
    { label: "TikTok", href: "{{TIKTOK_URL}}" },
  ],
  /** How far ahead to order, e.g. "48 hours for packs, 3 days for cakes". */
  leadTime: "{{ORDER_LEAD_TIME}}",
  /** Where she delivers, e.g. "Across Accra". */
  deliveryArea: "{{DELIVERY_AREA}}",
};

/**
 * Order / opening hours. 0 = Sunday … 6 = Saturday. Times are 24h "HH:MM".
 * Leave as `null` until she confirms; the "Open now" badge then reads
 * "Hours coming soon" instead of guessing.
 *
 * Example once confirmed:
 * hours: [
 *   { days: [1,2,3,4,5], open: "08:00", close: "18:00" },
 *   { days: [6], open: "09:00", close: "15:00" },
 * ]
 */
export const hours: { days: number[]; open: string; close: string }[] | null = null;
/** IANA timezone used for the open/closed badge. */
export const timeZone = "Africa/Accra"; // {{TIMEZONE}}: confirm with her location

/* ───────────────────────── Her words ───────────────────────── */

export const about = {
  title: "About RAAF",
  paragraphs: [
    "RAAF Professional Catering Services is a home-based catering business dedicated to providing delicious, high-quality meals for every occasion. We believe that good food brings people together, and we are here to make your moments special.",
    "We provide healthy, tasty, delicious, fresh meals and pastries for all your special occasions. You are in good hands with RAAF catering.",
  ],
  whyTitle: "Why choose us?",
  why: "At RAAF Professional Catering Services, we are passionate about good food and customer satisfaction. We use fresh ingredients, maintain high standards of hygiene and always deliver on time.",
};

/** The four promises, taken straight from "Why choose us?" */
export const promises = [
  {
    title: "Fresh ingredients",
    body: "Fresh ingredients in everything we make, from the flour in the pastry to the fish on the grill.",
    illustration: "milk" as IllustrationName,
  },
  {
    title: "High standards of hygiene",
    body: "A home kitchen run like a professional one. Clean hands, clean surfaces, every single time.",
    illustration: "whisk" as IllustrationName,
  },
  {
    title: "Always on time",
    body: "Your guests arrive, the food is already there. Warm, packed and ready.",
    illustration: "clock" as IllustrationName,
  },
  {
    title: "Good food brings people together",
    body: "Birthdays, naming ceremonies, meetings and Sunday lunches. We cook for the moment, not just the plate.",
    illustration: "table" as IllustrationName,
  },
];

/* ───────────────────────── Menu ───────────────────────── */

export type CategoryId =
  | "pastries"
  | "small-chops"
  | "breads"
  | "cakes"
  | "snacks"
  | "rice"
  | "chicken"
  | "ampesi"
  | "banku"
  | "fufu";

export type MenuItem = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  illustration: IllustrationName;
  /** null = not yet confirmed; UI shows "Price on request" */
  price: string | null;
  /** Shown first on the home page */
  signature?: boolean;
  /** Freshly baked: gets a steam curl */
  warm?: boolean;
  tags?: string[];
};

export const categories: { id: CategoryId; label: string; group: "bakery" | "meals"; blurb: string }[] = [
  { id: "pastries", label: "Pastries", group: "bakery", blurb: "Golden, flaky and filled to the edges." },
  { id: "small-chops", label: "Small chops", group: "bakery", blurb: "The bites that disappear first at every party." },
  { id: "breads", label: "Breads", group: "bakery", blurb: "Ten loaves, soft to hearty, baked in small batches." },
  { id: "cakes", label: "Cakes", group: "bakery", blurb: "Simple, tender sponges for every celebration." },
  { id: "snacks", label: "Chips", group: "bakery", blurb: "Crunchy, moreish, made for sharing." },
  { id: "rice", label: "Rice dishes", group: "meals", blurb: "Jollof, waakye and more, cooked for a crowd." },
  { id: "chicken", label: "Chicken", group: "meals", blurb: "Grilled or fried, always well seasoned." },
  { id: "ampesi", label: "Ampesi", group: "meals", blurb: "Boiled yam or plantain with rich, slow stews." },
  { id: "banku", label: "Banku", group: "meals", blurb: "Smooth banku, served the way it should be." },
  { id: "fufu", label: "Fufu", group: "meals", blurb: "Pounded comfort with soups that take their time." },
];

export const menu: MenuItem[] = [
  // Pastries
  { id: "meat-pie", name: "Meat pie", category: "pastries", illustration: "pie", price: null, signature: true, warm: true, description: "Short, buttery pastry crimped around a well-seasoned minced meat filling." },
  { id: "fish-pie", name: "Fish pie", category: "pastries", illustration: "pie", price: null, description: "The same golden crust, filled with savoury, peppery fish." },
  { id: "chicken-pie", name: "Chicken pie", category: "pastries", illustration: "pie", price: null, description: "Tender chicken folded into flaky pastry and baked until deep gold." },
  { id: "sausage-rolls", name: "Sausage rolls", category: "pastries", illustration: "sausageRoll", price: null, signature: true, warm: true, description: "Seasoned sausage wrapped in pastry that shatters at the first bite." },
  { id: "rock-buns", name: "Rock buns", category: "pastries", illustration: "rockBun", price: null, description: "Craggy outside, soft inside: the teatime classic." },
  { id: "quiche-lorraine", name: "Quiche lorraine", category: "pastries", illustration: "quiche", price: null, description: "A crisp pastry case holding a silky, savoury egg custard." },
  { id: "banana-bread-pastry", name: "Banana bread", category: "pastries", illustration: "bananaBread", price: null, description: "Ripe bananas baked into a moist, fragrant loaf." },
  { id: "banana-chocolate-bread", name: "Banana chocolate bread", category: "pastries", illustration: "bananaBread", price: null, signature: true, description: "Our banana bread with chocolate running all the way through." },

  // Small chops
  { id: "spring-rolls", name: "Spring rolls", category: "small-chops", illustration: "springRoll", price: null, signature: true, description: "Crisp, golden rolls packed with seasoned filling." },
  { id: "samosa", name: "Samosa", category: "small-chops", illustration: "samosa", price: null, description: "Neat pastry triangles with a warm, spiced filling." },
  { id: "ring-doughnut", name: "Ring doughnut", category: "small-chops", illustration: "doughnut", price: null, description: "Soft, light rings fried golden." },
  { id: "drop-doughnut", name: "Drop doughnut", category: "small-chops", illustration: "bofrot", price: null, description: "Little drops of sweet dough, crisp outside and fluffy within." },
  { id: "bofrot", name: "Bofrot", category: "small-chops", illustration: "bofrot", price: null, signature: true, description: "Ghana's favourite puff-puff, golden, pillowy and hard to stop at one." },
  { id: "gizzard-kebab", name: "Gizzard kebab", category: "small-chops", illustration: "kebab", price: null, description: "Peppery gizzard on skewers, grilled with onion and pepper." },
  { id: "chicken-wings-chops", name: "Chicken wings", category: "small-chops", illustration: "wings", price: null, description: "Seasoned wings, fried or grilled, made for party trays." },

  // Breads
  { id: "coconut-bread", name: "Coconut bread", category: "breads", illustration: "loaf", price: null, signature: true, warm: true, description: "Soft, sweet and fragrant with coconut." },
  { id: "banana-bread", name: "Banana bread", category: "breads", illustration: "bananaBread", price: null, description: "A tender loaf full of ripe banana." },
  { id: "tea-bread", name: "Tea bread", category: "breads", illustration: "loaf", price: null, warm: true, description: "The soft, slightly sweet loaf made for tea and butter." },
  { id: "marble-bread", name: "Marble bread", category: "breads", illustration: "marbleLoaf", price: null, description: "Swirls of chocolate and plain dough in every slice." },
  { id: "wheat-bread", name: "Wheat bread", category: "breads", illustration: "wheatLoaf", price: null, description: "A wholesome wheat loaf with a nutty crumb." },
  { id: "butter-bread", name: "Butter bread", category: "breads", illustration: "loaf", price: null, signature: true, warm: true, description: "Rich and pillowy, with butter in the dough and on the crust." },
  { id: "mixed-grain", name: "Mixed grain bread", category: "breads", illustration: "wheatLoaf", price: null, tags: ["Flaxseed", "Oat", "Wheat"], description: "Flaxseed, oats and wheat for a hearty, seeded loaf." },
  { id: "sugar-bread", name: "Sugar bread", category: "breads", illustration: "loaf", price: null, description: "Soft, sweet and golden, the one children ask for." },
  { id: "corn-bread", name: "Corn bread", category: "breads", illustration: "cornLoaf", price: null, description: "Golden, tender and gently sweet with corn." },
  { id: "soya-bread", name: "Soya bread", category: "breads", illustration: "wheatLoaf", price: null, description: "A nourishing loaf enriched with soya." },

  // Cakes
  { id: "vanilla-cake", name: "Vanilla cake", category: "cakes", illustration: "cake", price: null, signature: true, description: "A light, buttery vanilla sponge." },
  { id: "orange-cake", name: "Orange cake", category: "cakes", illustration: "orangeCake", price: null, description: "Bright with fresh orange." },
  { id: "banana-cake", name: "Banana cake", category: "cakes", illustration: "cake", price: null, description: "Moist and mellow with real banana." },
  { id: "chocolate-cake", name: "Chocolate cake", category: "cakes", illustration: "chocolateCake", price: null, description: "Deep, dark and generously chocolatey." },

  // Chips
  { id: "baked-chips", name: "Baked chips", category: "snacks", illustration: "chips", price: null, description: "Crunchy baked bites, lighter but just as moreish." },
  { id: "chin-chin", name: "Chin chin (sugar chips)", category: "snacks", illustration: "chips", price: null, signature: true, description: "Sweet, crunchy chin chin, the jar that empties itself." },
  { id: "onion-garlic-chips", name: "Fried chips (onion & garlic)", category: "snacks", illustration: "chips", price: null, description: "Savoury, crunchy and full of onion and garlic." },

  // Rice dishes
  { id: "jollof-grilled", name: "Jollof with grilled chicken", category: "rice", illustration: "jollof", price: null, signature: true, description: "Smoky, deep-red jollof with grilled chicken." },
  { id: "jollof-fried", name: "Jollof with fried chicken", category: "rice", illustration: "jollof", price: null, description: "Party jollof with crisp fried chicken." },
  { id: "jollof-goat", name: "Jollof with goat meat", category: "rice", illustration: "jollof", price: null, description: "Jollof with tender, well-spiced goat meat." },
  { id: "fried-rice", name: "Fried rice and chicken", category: "rice", illustration: "friedRice", price: null, description: "Colourful fried rice with chicken." },
  { id: "rice-gizzard", name: "Plain rice with gizzard sauce", category: "rice", illustration: "riceStew", price: null, description: "Fluffy white rice with a rich gizzard sauce." },
  { id: "rice-fried-chicken", name: "Plain rice with fried chicken & tomato sauce", category: "rice", illustration: "riceStew", price: null, description: "White rice, fried chicken and a slow tomato sauce." },
  { id: "rice-grilled-chicken", name: "Plain rice with grilled chicken", category: "rice", illustration: "riceStew", price: null, description: "Simple and satisfying: white rice with grilled chicken." },
  { id: "rice-sausage", name: "Plain rice with sausage sauce", category: "rice", illustration: "riceStew", price: null, description: "White rice with a hearty sausage sauce." },
  { id: "rice-beef", name: "Plain rice with beef sauce", category: "rice", illustration: "riceStew", price: null, description: "White rice with a deep, savoury beef sauce." },
  { id: "curry-rice", name: "Curry rice with chicken sauce", category: "rice", illustration: "friedRice", price: null, description: "Golden curry rice with a chicken sauce." },
  { id: "waakye-fish", name: "Waakye with fish, egg & wele", category: "rice", illustration: "waakye", price: null, description: "Waakye with fish, boiled egg and wele." },
  { id: "waakye-beef", name: "Waakye with beef, egg, wele & sausage", category: "rice", illustration: "waakye", price: null, description: "The full waakye plate: beef, egg, wele and sausage." },
  { id: "rice-balls", name: "Rice balls with groundnut soup", category: "rice", illustration: "soupBowl", price: null, description: "Soft rice balls in a rich groundnut soup." },

  // Chicken
  { id: "grilled-chicken", name: "Grilled chicken", category: "chicken", illustration: "drumstick", price: null, description: "Marinated and grilled until charred at the edges." },
  { id: "fried-chicken", name: "Fried chicken", category: "chicken", illustration: "drumstick", price: null, description: "Seasoned through and fried crisp." },
  { id: "chicken-wings", name: "Chicken wings, fried or grilled", category: "chicken", illustration: "wings", price: null, description: "Your choice of fried or grilled wings." },

  // Ampesi
  { id: "yam-palava", name: "Yam with palava sauce", category: "ampesi", illustration: "yam", price: null, description: "Boiled yam with kontomire palava sauce." },
  { id: "yam-garden-egg", name: "Yam with garden egg stew", category: "ampesi", illustration: "yam", price: null, description: "Boiled yam with a smoky garden egg stew." },
  { id: "plantain-palava", name: "Plantain with palava sauce", category: "ampesi", illustration: "plantain", price: null, description: "Boiled ripe plantain with palava sauce." },

  // Banku
  { id: "banku-okro", name: "Banku with okro stew or soup", category: "banku", illustration: "banku", price: null, description: "Smooth banku with okro, as stew or soup." },
  { id: "banku-tilapia", name: "Banku with grilled tilapia & pepper", category: "banku", illustration: "tilapia", price: null, signature: true, description: "Banku, whole grilled tilapia and fresh pepper." },

  // Fufu
  { id: "fufu-light", name: "Fufu with light soup & goat meat", category: "fufu", illustration: "soupBowl", price: null, description: "Fufu in a peppery light soup with goat meat." },
  { id: "fufu-groundnut", name: "Fufu with groundnut or palmnut soup", category: "fufu", illustration: "soupBowl", price: null, description: "Fufu with your choice of groundnut or palmnut soup." },
  { id: "fufu-abunabunu", name: "Fufu with abunabunu (green soup)", category: "fufu", illustration: "soupBowl", price: null, description: "Fufu with abunabunu, the deep green kontomire soup." },
];

/** Small-chops packs, exactly as combined in her notes. */
export const packs: { id: string; name: string; items: { qty?: number; name: string }[]; price: string | null; note?: string }[] = [
  {
    id: "pack-1",
    name: "The classic four",
    items: [
      { qty: 1, name: "Meat pie" },
      { qty: 1, name: "Samosa" },
      { qty: 1, name: "Spring roll" },
      { qty: 1, name: "Gizzard kebab" },
    ],
    price: null, // {{PRICE_PACK_1}}
  },
  {
    id: "pack-2",
    name: "Sweet & savoury",
    items: [
      { qty: 1, name: "Meat pie" },
      { qty: 1, name: "Samosa" },
      { qty: 1, name: "Ring doughnut" },
      { qty: 1, name: "Chicken wings" },
    ],
    price: null, // {{PRICE_PACK_2}}: her note says "60" beside this pack; confirm amount and currency
  },
  {
    id: "pack-3",
    name: "The celebration box",
    items: [
      { qty: 1, name: "Vanilla cake" },
      { qty: 1, name: "Meat pie" },
      { qty: 1, name: "Samosa" },
      { qty: 1, name: "Spring roll" },
      { qty: 2, name: "Gizzard kebab" },
      { qty: 1, name: "Chicken wings" },
    ],
    price: null, // {{PRICE_PACK_3}}
  },
  {
    id: "pack-4",
    name: "Something for everyone",
    items: [
      { qty: 1, name: "Banana bread or cake" },
      { qty: 1, name: "Meat pie" },
      { qty: 1, name: "Spring roll or samosa" },
      { qty: 1, name: "Chicken wings" },
      { qty: 1, name: "Gizzard kebab" },
      { qty: 1, name: "Ring doughnut" },
    ],
    price: null, // {{PRICE_PACK_4}}
  },
  {
    id: "pack-5",
    name: "Party tray",
    items: [
      { name: "Sausage rolls" },
      { name: "Spring rolls" },
      { name: "Chicken wings" },
      { name: "Vanilla cake" },
    ],
    price: null, // {{PRICE_PACK_5}}
  },
  {
    id: "pack-6",
    name: "Doughnut lover's",
    items: [
      { qty: 1, name: "Sausage roll" },
      { qty: 2, name: "Drop doughnuts" },
      { qty: 1, name: "Spring roll" },
      { qty: 1, name: "Gizzard or chicken" },
    ],
    price: null, // {{PRICE_PACK_6}}: her note says "60" beside this pack; confirm amount and currency
  },
];

/* ───────────────────────── The bake story ───────────────────────── */

export const bakeStages = [
  { id: "flour", title: "Flour", line: "It starts before sunrise, with flour sifted soft as dust." },
  { id: "milk", title: "Milk", line: "Fresh milk, poured slow, brings it together." },
  { id: "butter", title: "Butter", line: "Butter goes in generously. You can taste when it doesn't." },
  { id: "knead", title: "Knead", line: "Then hands, and time, and a little patience." },
  { id: "rise", title: "Rise", line: "We leave it to rise in the warm kitchen." },
  { id: "oven", title: "Oven", line: "Into the heat, where the whole house starts to smell like home." },
  { id: "loaf", title: "Golden", line: "Out comes something golden, ready for your table." },
] as const;

/* ───────────────────────── Photos ───────────────────────── */

/**
 * Photo slots. Drop her real photos into /public/photos with these exact
 * file names (or change `src`) and they appear across the site.
 * Until then each slot shows a stand-in stock photo (Unsplash), see README.
 * Photos look best at about 1600px on the long side, saved as WebP or JPG.
 */
export const photos = {
  owner: { src: "/photos/REPLACE-owner.webp" },
  kitchen: { src: "/photos/REPLACE-kitchen.webp" },
};

export const gallery: { id: string; caption: string; illustration: IllustrationName; src: string; ratio: "tall" | "wide" | "square" }[] = [
  { id: "g1", caption: "Meat pies, fresh from the oven", illustration: "pie", src: "/photos/REPLACE-gallery-01.webp", ratio: "tall" },
  { id: "g2", caption: "Party jollof", illustration: "jollof", src: "/photos/REPLACE-gallery-02.webp", ratio: "square" },
  { id: "g3", caption: "A small chops platter", illustration: "springRoll", src: "/photos/REPLACE-gallery-03.webp", ratio: "wide" },
  { id: "g4", caption: "Butter bread", illustration: "loaf", src: "/photos/REPLACE-gallery-04.webp", ratio: "square" },
  { id: "g5", caption: "Bofrot", illustration: "bofrot", src: "/photos/REPLACE-gallery-05.webp", ratio: "tall" },
  { id: "g6", caption: "Celebration cake", illustration: "cake", src: "/photos/REPLACE-gallery-06.webp", ratio: "square" },
  { id: "g7", caption: "Grilled tilapia", illustration: "tilapia", src: "/photos/REPLACE-gallery-07.webp", ratio: "wide" },
  { id: "g8", caption: "Marble bread", illustration: "marbleLoaf", src: "/photos/REPLACE-gallery-08.webp", ratio: "tall" },
  { id: "g9", caption: "Chin chin", illustration: "chips", src: "/photos/REPLACE-gallery-09.webp", ratio: "square" },
  { id: "g10", caption: "Jollof with grilled chicken", illustration: "jollof", src: "/photos/REPLACE-gallery-10.webp", ratio: "square" },
  { id: "g11", caption: "Chocolate cake", illustration: "chocolateCake", src: "/photos/REPLACE-gallery-11.webp", ratio: "tall" },
  { id: "g12", caption: "Sausage rolls", illustration: "sausageRoll", src: "/photos/REPLACE-gallery-12.webp", ratio: "wide" },
];

/* ───────────────────────── Navigation ───────────────────────── */

export const nav = [
  { href: "/menu/", label: "Menu" },
  { href: "/story/", label: "Our story" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/order/", label: "Order" },
];

/* ───────────────────────── Helpers ───────────────────────── */

export const whatsappHref = (message = "Hello RAAF, I'd like to place an order.") =>
  isPlaceholder(business.whatsapp)
    ? null
    : `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const telHref = () => (isPlaceholder(business.phone) ? null : `tel:+${business.phone.replace(/\D/g, "")}`);

export const mailHref = (subject = "Order enquiry") =>
  isPlaceholder(business.email) ? null : `mailto:${business.email}?subject=${encodeURIComponent(subject)}`;

export const priceLabel = (p: string | null) => (isPlaceholder(p) ? "Price on request" : `${business.currency} ${p}`);

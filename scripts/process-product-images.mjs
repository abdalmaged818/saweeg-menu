import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const sourceDirectory = path.join(
  projectRoot,
  "assets-source",
  "product-images"
);
const outputDirectory = path.join(
  projectRoot,
  "public",
  "assets",
  "products"
);

const MAX_SIDE = 1400;
const BACKGROUND = "#E9E5DB";
const WEBP_QUALITY = 86;

const imageJobs = [
  ["الجابرة تلبينة.jpg", "al-jabirah-box.webp"],
  ["الدمكة.jpg", "damkah.webp"],
  ["ايسكريم تلبينة نبوية.jpg", "talbinah-ice-cream.webp"],
  ["بودرة سويق.jpg", "sawiq-powder.webp"],
  ["بوكس الاهداء.jpg", "gift-box.webp"],
  ["بوكس التلبينة.jpg", "talbinah-sachet-box.webp"],
  ["بوكس بسبوسه.jpg", "basbousa-box.webp"],
  ["بوكس معمول.jpg", "maamoul-box.webp"],
  ["تلبينة باردة.jpg", "cold-talbinah.webp"],
  ["تلبينة حاره.jpg", "hot-talbinah.webp"],
  ["تلبينه لوتس تشيز كيك.jpg", "talbinah-lotus-cheesecake.webp"]
];

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

await fs.mkdir(outputDirectory, { recursive: true });

for (const [sourceName, outputName] of imageJobs) {
  const sourcePath = path.join(sourceDirectory, sourceName);
  const outputPath = path.join(outputDirectory, outputName);

  if (!(await fileExists(sourcePath))) {
    throw new Error(`Missing source image: ${sourcePath}`);
  }

  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read image dimensions: ${sourcePath}`);
  }

  const shouldSwapDimensions =
    metadata.orientation !== undefined &&
    metadata.orientation >= 5 &&
    metadata.orientation <= 8;
  const orientedWidth = shouldSwapDimensions
    ? metadata.height
    : metadata.width;
  const orientedHeight = shouldSwapDimensions
    ? metadata.width
    : metadata.height;
  const canvasSide = Math.min(
    MAX_SIDE,
    Math.max(orientedWidth, orientedHeight)
  );
  const outputBuffer = await sharp(sourcePath)
    .rotate()
    .toColourspace("srgb")
    .resize({
      width: canvasSide,
      height: canvasSide,
      fit: "contain",
      position: "centre",
      background: BACKGROUND,
      withoutEnlargement: true
    })
    .webp({
      quality: WEBP_QUALITY,
      effort: 6,
      smartSubsample: true
    })
    .toBuffer();

  const outputMetadata = await sharp(outputBuffer).metadata();
  if (
    outputMetadata.format !== "webp" ||
    outputMetadata.width !== canvasSide ||
    outputMetadata.height !== canvasSide
  ) {
    throw new Error(`Image verification failed: ${outputName}`);
  }

  await fs.writeFile(outputPath, outputBuffer);

  const outputStats = await fs.stat(outputPath);
  console.log(
    `${sourceName} -> ${outputName} (${canvasSide}x${canvasSide}, ${Math.round(
      outputStats.size / 1024
    )} KB)`
  );
}

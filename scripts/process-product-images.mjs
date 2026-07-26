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
const WEBP_QUALITY = 86;

const imageJobs = [
  {
    sourceName: "الجابرة تلبينة.jpg",
    outputName: "al-jabirah-box.webp",
    verticalCrop: 0.78
  },
  {
    sourceName: "الدمكة.jpg",
    outputName: "damkah.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "ايسكريم تلبينة نبوية.jpg",
    outputName: "talbinah-ice-cream.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "بودرة سويق.jpg",
    outputName: "sawiq-powder.webp",
    verticalCrop: 0.83
  },
  {
    sourceName: "بوكس الاهداء.jpg",
    outputName: "gift-box.webp",
    verticalCrop: 1
  },
  {
    sourceName: "بوكس التلبينة.jpg",
    outputName: "talbinah-sachet-box.webp",
    verticalCrop: 1
  },
  {
    sourceName: "بوكس بسبوسه.jpg",
    outputName: "basbousa-box.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "بوكس معمول.jpg",
    outputName: "maamoul-box.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "تلبينة باردة.jpg",
    outputName: "cold-talbinah.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "تلبينة حاره.jpg",
    outputName: "hot-talbinah.webp",
    verticalCrop: 0.55
  },
  {
    sourceName: "تلبينه لوتس تشيز كيك.jpg",
    outputName: "talbinah-lotus-cheesecake.webp",
    verticalCrop: 0.5
  }
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

for (const { sourceName, outputName, verticalCrop } of imageJobs) {
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
  const cropSide = Math.min(orientedWidth, orientedHeight);
  const cropLeft = Math.round((orientedWidth - cropSide) / 2);
  const cropTop = Math.round(
    (orientedHeight - cropSide) * verticalCrop
  );
  const outputSide = Math.min(MAX_SIDE, cropSide);
  const outputBuffer = await sharp(sourcePath)
    .rotate()
    .toColourspace("srgb")
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropSide,
      height: cropSide
    })
    .resize({
      width: outputSide,
      height: outputSide,
      fit: "cover",
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
    outputMetadata.width !== outputSide ||
    outputMetadata.height !== outputSide
  ) {
    throw new Error(`Image verification failed: ${outputName}`);
  }

  await fs.writeFile(outputPath, outputBuffer);

  const outputStats = await fs.stat(outputPath);
  console.log(
    `${sourceName} -> ${outputName} (${outputSide}x${outputSide}, crop top ${cropTop}px, ${Math.round(
      outputStats.size / 1024
    )} KB)`
  );
}

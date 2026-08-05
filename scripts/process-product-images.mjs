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

const OUTPUT_SIDE = 1400;
const WEBP_QUALITY = 86;
const CANVAS_COLOR = { r: 248, g: 246, b: 241, alpha: 1 };

const imageJobs = [
  {
    sourceName: "الجابرة تلبينة.jpg",
    outputName: "talbinah-powder.webp",
    verticalCrop: 0.78
  },
  {
    sourceName: "الدمكة.jpg",
    outputName: "damkah.webp",
    verticalCrop: 0.5
  },
  {
    sourceName: "ايسكريم بالتلبينة النبوية مع مكسرات.jpg",
    outputName: "talbinah-ice-cream.webp",
    processing: "contain"
  },
  {
    sourceName: "ايسكريم المانجو.jpg",
    outputName: "mango-ice-cream.webp",
    processing: "contain"
  },
  {
    sourceName: "ايسكريم مكس.jpg",
    outputName: "mixed-ice-cream.webp",
    processing: "contain"
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
    outputName: "al-jabirah-box.webp",
    verticalCrop: 1
  },
  {
    sourceName: "بوكس بسبوسه.jpg",
    outputName: "date-pecan-tart-box.webp",
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
    sourceName: "تشيز كيك.jpg",
    outputName: "talbinah-lotus-cheesecake.webp",
    processing: "contain"
  },
  {
    sourceName: "تمر بالسويق.JPG",
    outputName: "dates-with-saweeg.webp",
    processing: "contain"
  },
  {
    sourceName: "كريب مديني أجبان.jpg",
    outputName: "madini-crepe-cheese.webp",
    processing: "contain"
  },
  {
    sourceName: "كريب مديني سجنتشر.jpg",
    outputName: "madini-crepe-signature.webp",
    processing: "contain"
  },
  {
    sourceName: "تمر صفاوي.jpg",
    outputName: "safawi-dates-gift-box.webp",
    processing: "contain"
  },
  {
    sourceName: "ظرف التلبينة.JPG",
    outputName: "talbinah-sachet-box.webp",
    processing: "contain"
  },
  {
    sourceName: "أظرف التلبينة.JPG",
    outputName: "talbinah-sachets.webp",
    processing: "contain"
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

for (const {
  sourceName,
  outputName,
  verticalCrop = 0.5,
  processing = "crop"
} of imageJobs) {
  const sourcePath = path.join(sourceDirectory, sourceName);
  const outputPath = path.join(outputDirectory, outputName);

  if (!(await fileExists(sourcePath))) {
    throw new Error(`Missing source image: ${sourcePath}`);
  }

  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read image dimensions: ${sourcePath}`);
  }

  let outputBuffer;
  let outputSide;
  let processingSummary;

  if (processing === "contain") {
    outputSide = OUTPUT_SIDE;
    processingSummary = "contain on brand canvas";
    outputBuffer = await sharp(sourcePath)
      .rotate()
      .toColourspace("srgb")
      .resize({
        width: OUTPUT_SIDE,
        height: OUTPUT_SIDE,
        fit: "contain",
        position: "centre",
        background: CANVAS_COLOR,
        withoutEnlargement: true
      })
      .webp({
        quality: WEBP_QUALITY,
        effort: 6,
        smartSubsample: true
      })
      .toBuffer();
  } else {
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
    outputSide = Math.min(OUTPUT_SIDE, cropSide);
    processingSummary = `crop top ${cropTop}px`;
    outputBuffer = await sharp(sourcePath)
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
  }

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
    `${sourceName} -> ${outputName} (${outputSide}x${outputSide}, ${processingSummary}, ${Math.round(
      outputStats.size / 1024
    )} KB)`
  );
}

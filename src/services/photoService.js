/**
 * Photo handling for family and place memories.
 *
 * Phone cameras produce 3-8 MB images. Those are far too large to hold in the
 * in-memory store, to sync over a rural 2G connection, or to keep in
 * localStorage for offline use. Everything is downscaled and re-encoded to a
 * compact JPEG data URL before it leaves this module.
 */

const MAX_DIMENSION = 900;   // plenty for a full-width phone card
const TARGET_QUALITY = 0.72;
const MAX_BYTES = 900 * 1024;

/** Reads a File into a data URL. */
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That file does not look like a photo.'));
    img.src = src;
  });
}

/**
 * Downscales and compresses a chosen photo.
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 */
export async function compressPhoto(file) {
  if (!file) throw new Error('Please choose a photo.');
  if (!file.type.startsWith('image/')) throw new Error('Please choose a photo file.');

  const raw = await readAsDataURL(file);
  const img = await loadImage(raw);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  let quality = TARGET_QUALITY;
  let dataUrl = canvas.toDataURL('image/jpeg', quality);

  // Step the quality down until it fits; a portrait of a relative does not
  // need to be pristine, it needs to load on a weak connection.
  while (dataUrl.length > MAX_BYTES && quality > 0.35) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  return { dataUrl, width, height };
}

/** Human-readable size of a data URL, for the caregiver's reassurance. */
export function approxSizeKB(dataUrl) {
  if (!dataUrl) return 0;
  const base64 = dataUrl.split(',')[1] || '';
  return Math.round((base64.length * 3) / 4 / 1024);
}

export default { compressPhoto, approxSizeKB };

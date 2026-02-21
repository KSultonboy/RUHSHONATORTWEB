import { apiOrigin } from "./api-base";

export function toAbsoluteImage(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${apiOrigin}${image.startsWith("/") ? image : `/${image}`}`;
}

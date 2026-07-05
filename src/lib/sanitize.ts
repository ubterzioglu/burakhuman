import sanitizeHtml from "sanitize-html";

export function cleanHtml(html: string | null | undefined) {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "class"],
      img: ["src", "alt", "width", "height", "class"],
      p: ["class"],
      div: ["class"],
      span: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function imagePath(fileName: string | null | undefined, size: "orjinal" | "orta" | "thumb" | "books" | "img" = "orta") {
  if (!fileName) return "/img/placehold.jpg";
  if (fileName.startsWith("/") || fileName.startsWith("http")) return fileName;
  if (size === "img") return `/img/${fileName}`;
  if (size === "books") return `/Dosyalar/books/${fileName}`;
  return `/Dosyalar/${size}/${fileName}`;
}

import type { CSSProperties } from "react";
import type { IllustrationName } from "./index";
import { asset } from "@/lib/site";

/**
 * A food illustration as a static image (/public/illustrations/<name>.svg).
 * Same drawing as <Illustration>, but zero DOM/hydration cost and cached once.
 * Regenerate the files with scripts/make-illustrations.mjs after editing the art.
 */
export function Illo({ name, className, style, alt = "", eager = false, size = 200 }: { name: IllustrationName; className?: string; style?: CSSProperties; alt?: string; eager?: boolean; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(`/illustrations/${name}.svg`)} alt={alt} width={size} height={size} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} className={className} style={style} />
  );
}

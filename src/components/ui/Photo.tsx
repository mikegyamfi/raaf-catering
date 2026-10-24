import Image from "next/image";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/site";

/**
 * A photo slot. Files named REPLACE-*.webp in /public/photos are drawn
 * placeholders. Drop her real photo in with the same name and it appears.
 */
export function Photo({ src, alt, className, sizes = "(min-width: 900px) 40vw, 90vw", priority }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] bg-flour-deep", className)}>
      <Image src={asset(src)} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.04]" />
    </div>
  );
}

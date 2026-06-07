import Image from "next/image";
import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom OonkoO brand icons.
 *
 * The SVG assets in /public/oonkoo-icons are rich, pre-colored (glassy
 * brand-green) artwork — NOT monochrome `currentColor` line icons, and they
 * embed raster data — so they are served as static files via next/image
 * (`unoptimized`, which also sidesteps the image optimizer's SVG restriction)
 * rather than inlined into the JS bundle.
 *
 * Each icon is exposed as a lucide-style component that accepts `className` /
 * `size`, so it's a drop-in replacement wherever a lucide icon is expected:
 *
 *   import { OonkooIcons } from "@/components/ui/oonkoo-icon";
 *   const Icon = OonkooIcons.Code;
 *   <Icon size={56} className="mb-6" />
 */

export const OONKOO_ICON_NAMES = [
  "Ai",
  "BookOpen",
  "Cloud",
  "Code",
  "Cybersecurity",
  "Globe",
  "LineChart",
  "Megaphone",
  "Palatte",
  "Server",
  "ShoppingBag",
  "Smartphone",
  "Users",
  "Vr",
  "WebApp",
] as const;

export type OonkooIconName = (typeof OONKOO_ICON_NAMES)[number];

export interface OonkooIconProps {
  className?: string;
  /** Rendered width/height in px. Defaults to 48. */
  size?: number;
  style?: CSSProperties;
}

export type OonkooIconComponent = ComponentType<OonkooIconProps>;

function createOonkooIcon(name: OonkooIconName): OonkooIconComponent {
  const Icon = ({ className, size = 48, style }: OonkooIconProps) => (
    <Image
      src={`/oonkoo-icons/${name}.svg`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={style}
      unoptimized
      className={cn("object-contain", className)}
    />
  );
  Icon.displayName = `OonkooIcon.${name}`;
  return Icon;
}

/** Map of every brand icon as a ready-to-use component. */
export const OonkooIcons: Record<OonkooIconName, OonkooIconComponent> = {
  Ai: createOonkooIcon("Ai"),
  BookOpen: createOonkooIcon("BookOpen"),
  Cloud: createOonkooIcon("Cloud"),
  Code: createOonkooIcon("Code"),
  Cybersecurity: createOonkooIcon("Cybersecurity"),
  Globe: createOonkooIcon("Globe"),
  LineChart: createOonkooIcon("LineChart"),
  Megaphone: createOonkooIcon("Megaphone"),
  Palatte: createOonkooIcon("Palatte"),
  Server: createOonkooIcon("Server"),
  ShoppingBag: createOonkooIcon("ShoppingBag"),
  Smartphone: createOonkooIcon("Smartphone"),
  Users: createOonkooIcon("Users"),
  Vr: createOonkooIcon("Vr"),
  WebApp: createOonkooIcon("WebApp"),
};

/** Render any brand icon by name: `<OonkooIcon name="Code" size={56} />`. */
export function OonkooIcon({
  name,
  ...props
}: OonkooIconProps & { name: OonkooIconName }) {
  const Icon = OonkooIcons[name];
  return <Icon {...props} />;
}

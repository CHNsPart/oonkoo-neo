import Image from "next/image";
import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom OonkoO brand icons.
 *
 * The PNG assets in /public/oonkoo-icons are rich, pre-colored (glassy
 * brand-green) artwork — NOT monochrome `currentColor` line icons. They are
 * served via next/image (which downscales the large source to the rendered
 * size and serves optimized WebP) rather than inlined into the JS bundle.
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
  "Bulb",
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
  "Success",
  "Quality",
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
      src={`/oonkoo-icons/${name}.png`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      style={style}
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
  Bulb: createOonkooIcon("Bulb"),
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
  Success: createOonkooIcon("Success"),
  Quality: createOonkooIcon("Quality"),
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

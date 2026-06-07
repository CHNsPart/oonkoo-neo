import Image from "next/image";
import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom OonkoO brand icons.
 *
 * These live as standalone SVG assets in /public/oonkoo-icons. They are rich,
 * pre-colored (glassy brand-green) artwork — NOT monochrome `currentColor` line
 * icons — so they are served as static files via next/image rather than inlined.
 *
 * Each icon is exposed as a lucide-style component that accepts `className` /
 * `size`, so it can be used as a drop-in replacement wherever a lucide icon is
 * expected (e.g. `icon: OonkooIcons.Code` then `<Icon size={56} />`).
 */

export const OONKOO_ICON_NAMES = [
  "BookOpen",
  "Cloud",
  "Code",
  "LineChart",
  "Megaphone",
  "Palatte",
  "ShoppingBag",
  "Smartphone",
  "Users",
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
  BookOpen: createOonkooIcon("BookOpen"),
  Cloud: createOonkooIcon("Cloud"),
  Code: createOonkooIcon("Code"),
  LineChart: createOonkooIcon("LineChart"),
  Megaphone: createOonkooIcon("Megaphone"),
  Palatte: createOonkooIcon("Palatte"),
  ShoppingBag: createOonkooIcon("ShoppingBag"),
  Smartphone: createOonkooIcon("Smartphone"),
  Users: createOonkooIcon("Users"),
};

/** Render any brand icon by name: `<OonkooIcon name="Code" size={56} />`. */
export function OonkooIcon({
  name,
  ...props
}: OonkooIconProps & { name: OonkooIconName }) {
  const Icon = OonkooIcons[name];
  return <Icon {...props} />;
}

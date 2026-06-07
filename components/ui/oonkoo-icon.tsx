import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

import AiSvg from "@/public/oonkoo-icons/Ai.svg";
import BookOpenSvg from "@/public/oonkoo-icons/BookOpen.svg";
import CloudSvg from "@/public/oonkoo-icons/Cloud.svg";
import CodeSvg from "@/public/oonkoo-icons/Code.svg";
import CybersecuritySvg from "@/public/oonkoo-icons/Cybersecurity.svg";
import GlobeSvg from "@/public/oonkoo-icons/Globe.svg";
import LineChartSvg from "@/public/oonkoo-icons/LineChart.svg";
import MegaphoneSvg from "@/public/oonkoo-icons/Megaphone.svg";
import PalatteSvg from "@/public/oonkoo-icons/Palatte.svg";
import ServerSvg from "@/public/oonkoo-icons/Server.svg";
import ShoppingBagSvg from "@/public/oonkoo-icons/ShoppingBag.svg";
import SmartphoneSvg from "@/public/oonkoo-icons/Smartphone.svg";
import UsersSvg from "@/public/oonkoo-icons/Users.svg";
import VrSvg from "@/public/oonkoo-icons/Vr.svg";
import WebAppSvg from "@/public/oonkoo-icons/WebApp.svg";

/**
 * Custom OonkoO brand icons.
 *
 * The SVG assets in /public/oonkoo-icons are imported as React components via
 * SVGR (configured in next.config.ts). Each is re-exported here as a lucide-style
 * component that accepts `className` / `size` (plus any SVG prop), so it's a
 * drop-in replacement wherever a lucide icon is expected:
 *
 *   import { OonkooIcons } from "@/components/ui/oonkoo-icon";
 *   const Icon = OonkooIcons.Code;
 *   <Icon size={56} className="text-brand-primary" />
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

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface OonkooIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  /** Convenience for setting width & height together (px). Defaults to 48. */
  size?: number;
}

export type OonkooIconComponent = ComponentType<OonkooIconProps>;

const RAW_ICONS: Record<OonkooIconName, SvgComponent> = {
  Ai: AiSvg,
  BookOpen: BookOpenSvg,
  Cloud: CloudSvg,
  Code: CodeSvg,
  Cybersecurity: CybersecuritySvg,
  Globe: GlobeSvg,
  LineChart: LineChartSvg,
  Megaphone: MegaphoneSvg,
  Palatte: PalatteSvg,
  Server: ServerSvg,
  ShoppingBag: ShoppingBagSvg,
  Smartphone: SmartphoneSvg,
  Users: UsersSvg,
  Vr: VrSvg,
  WebApp: WebAppSvg,
};

function createOonkooIcon(name: OonkooIconName): OonkooIconComponent {
  const Svg = RAW_ICONS[name];
  const Icon = ({ className, size = 48, width, height, ...props }: OonkooIconProps) => (
    <Svg
      width={width ?? size}
      height={height ?? size}
      className={cn("object-contain", className)}
      {...props}
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

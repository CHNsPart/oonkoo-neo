// SVGR: importing an SVG returns a React component by default.
// Use the `?url` query suffix to import the file URL as a string instead.
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}

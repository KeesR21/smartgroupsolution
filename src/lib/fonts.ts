import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

/** Body copy — optimized for readability at all sizes */
export const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Headings & display text — crisp on retina / high-DPI screens */
export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;

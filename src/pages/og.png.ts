import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import config from "@/config";

const PAPER = "#f2efe6";
const INK = "#1c1a16";
const ACCENT = "#a2571a";
const MUTED = "#6b655b";

export const GET: APIRoute = async context => {
  const fonts = fontData["--font-ibm-plex-mono"];
  const regularFontPath = getFontPathByWeight(fonts, 400);
  const mediumFontPath =
    getFontPathByWeight(fonts, 600) ?? getFontPathByWeight(fonts, 500);
  const boldFontPath =
    getFontPathByWeight(fonts, 700) ?? mediumFontPath ?? regularFontPath;

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the font path.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, context.url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: PAPER,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "IBM Plex Mono",
          color: INK,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: ACCENT,
                marginBottom: 28,
              },
              children: "NAME",
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 64,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 24,
              },
              children: "unstripped",
            },
          },
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: 3,
                background: INK,
                marginBottom: 28,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 28,
                color: MUTED,
                lineHeight: 1.4,
              },
              children: config.site.description,
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 48,
                right: 96,
                fontSize: 22,
                color: MUTED,
                letterSpacing: "0.04em",
              },
              children: "unstripped.dev",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "IBM Plex Mono",
          data: regularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "IBM Plex Mono",
          data: boldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};

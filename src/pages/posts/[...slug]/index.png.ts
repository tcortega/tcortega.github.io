import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import satori from "satori";
import sharp from "sharp";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

const PAPER = "#f2efe6";
const INK = "#1c1a16";
const ACCENT = "#a2571a";
const MUTED = "#6b655b";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

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
    fetch(experimental_getFontFileURL(regularFontPath, url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, url)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  const title = props.data.title as string;
  const category = (props.data.category as string | undefined) ?? "re";

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
          justifyContent: "space-between",
          padding: "72px 88px",
          fontFamily: "IBM Plex Mono",
          color: INK,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "0.16em",
                      color: ACCENT,
                      marginBottom: 24,
                    },
                    children: "NAME",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 60 ? 36 : 44,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      maxHeight: "340px",
                      overflow: "hidden",
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
                borderTop: `2px solid ${INK}`,
                paddingTop: 28,
                fontSize: 22,
                color: MUTED,
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: { color: ACCENT },
                    children: category,
                  },
                },
                {
                  type: "span",
                  props: {
                    children: "unstripped.dev",
                  },
                },
              ],
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

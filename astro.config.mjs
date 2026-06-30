// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeCitation from "rehype-citation";
import { visit } from "unist-util-visit";

function remarkMathFencedBlock() {
  /** @param {any} tree */
  return (tree) => {
    // @ts-ignore
    visit(
      tree,
      "code",
      (
        /** @type {any} */ node,
        /** @type {number} */ index,
        /** @type {any} */ parent,
      ) => {
        if (node.lang === "math") {
          let id = null;
          if (node.meta) {
            const match = node.meta.match(/\[([^\]]+)\]/);
            if (match) id = match[1];
          }
          if (!id) {
            id = `eq-auto-${Math.random().toString(36).slice(2, 8)}`;
          }

          const nodes = [
            {
              type: "html",
              value: `<div id="${id}" class="numbered-math scroll-mt-24">`,
            },
            {
              type: "math",
              value: node.value,
              data: {
                hName: "pre",
                hChildren: [
                  {
                    type: "element",
                    tagName: "code",
                    properties: {
                      className: ["language-math", "math-display"],
                    },
                    children: [
                      {
                        type: "text",
                        value: node.value,
                      },
                    ],
                  },
                ],
              },
            },
            { type: "html", value: `</div>` },
          ];

          parent.children.splice(index, 1, ...nodes);
          return index + 3;
        }
      },
    );
  };
}

function remarkAutoLinkRefs() {
  /** @param {any} tree */
  return (tree) => {
    // @ts-ignore
    visit(
      tree,
      "text",
      (
        /** @type {any} */ node,
        /** @type {number} */ index,
        /** @type {any} */ parent,
      ) => {
        // Avoid processing text inside links or other nodes that shouldn't be parsed
        if (!parent || parent.type === "link") return;

        const regex = /\[#([^\]]+)\]/g;
        let match;
        let lastIndex = 0;
        const newNodes = [];

        while ((match = regex.exec(node.value)) !== null) {
          // Text before the match
          if (match.index > lastIndex) {
            newNodes.push({
              type: "text",
              value: node.value.substring(lastIndex, match.index),
            });
          }

          // The matched reference
          newNodes.push({
            type: "link",
            url: `#${match[1]}`,
            children: [{ type: "text", value: "ref" }],
          });

          lastIndex = regex.lastIndex;
        }

        // Text after the last match
        if (lastIndex < node.value.length) {
          newNodes.push({
            type: "text",
            value: node.value.substring(lastIndex),
          });
        }

        if (newNodes.length > 0) {
          parent.children.splice(index, 1, ...newNodes);
          return index + newNodes.length; // Skip the newly inserted nodes
        }
      },
    );
  };
}

function rehypeAutoRefs() {
  /** @param {any} tree */
  return (tree) => {
    let h2Count = 0;
    let h3Count = 0;
    let figCount = 0;
    let eqCount = 0;

    /** @type {Record<string, {type: string, number: string}>} */
    const dictionary = {};

    // @ts-ignore
    visit(
      tree,
      "element",
      (
        /** @type {any} */ node,
        /** @type {number} */ index,
        /** @type {any} */ parent,
      ) => {
        // Headings
        if (node.tagName === "h2") {
          h2Count++;
          h3Count = 0;
          if (node.properties?.id) {
            dictionary[node.properties.id] = {
              type: "Section",
              number: `${h2Count}`,
            };
          }
        }
        if (node.tagName === "h3") {
          h3Count++;
          if (node.properties?.id) {
            dictionary[node.properties.id] = {
              type: "Section",
              number: `${h2Count}.${h3Count}`,
            };
          }
        }
        // Figures
        if (node.tagName === "figure") {
          figCount++;
          if (node.properties?.id) {
            dictionary[node.properties.id] = {
              type: "Figure",
              number: `${figCount}`,
            };
          }
        }
        // Equations
        if (
          node.tagName === "span" &&
          node.properties?.className?.includes("katex-display")
        ) {
          if (index > 0 && parent && parent.children) {
            const prevNode = parent.children[index - 1];
            let targetHtmlNode = prevNode;
            if (prevNode.type === "text" && index > 1) {
              targetHtmlNode = parent.children[index - 2];
            }

            if (
              (targetHtmlNode.type === "html" ||
                targetHtmlNode.type === "raw") &&
              typeof targetHtmlNode.value === "string"
            ) {
              const match = targetHtmlNode.value.match(
                /<div[^>]*id=["']([^"']+)["']/i,
              );
              if (match && targetHtmlNode.value.includes("numbered-math")) {
                eqCount++;
                dictionary[match[1]] = {
                  type: "Equation",
                  number: `${eqCount}`,
                };
              }
            }
          }
        }
      },
    );

    console.log("ASTRO DICTIONARY:", dictionary);
    // Second pass: Replace references
    // @ts-ignore
    visit(tree, "element", (/** @type {any} */ node) => {
      if (node.tagName === "a" && node.properties?.href?.startsWith("#")) {
        const targetId = node.properties.href.substring(1);
        if (dictionary[targetId]) {
          const ref = dictionary[targetId];
          node.children = [
            { type: "text", value: `${ref.type} ${ref.number}` },
          ];
          node.properties.className = (node.properties.className || []).concat([
            "text-zinc-400",
            "hover:text-zinc-300",
            "no-underline",
            "transition-colors",
          ]);
        }
      }
    });
  };
}

function astroFrontmatterToRehypeCitation() {
  /**
   * @param {any} _tree
   * @param {any} file
   */
  return (_tree, file) => {
    if (file.data.astro?.frontmatter?.bibliography) {
      file.data.frontmatter = file.data.frontmatter || {};
      file.data.frontmatter.bibliography =
        file.data.astro.frontmatter.bibliography;
    }
  };
}

function rehypeImagesToFigure() {
  /** @param {any} tree */
  return (tree) => {
    // @ts-ignore
    visit(tree, "element", (/** @type {any} */ node) => {
      // Find paragraphs that contain only a single image
      if (
        node.tagName === "p" &&
        node.children.length === 1 &&
        node.children[0].tagName === "img"
      ) {
        const img = node.children[0];

        // Transform the <p> into a <figure>
        node.tagName = "figure";
        node.properties = {
          className: ["my-10", "flex", "flex-col", "items-center"],
        };

        // Make the image beautiful
        img.properties.className = (img.properties.className || []).concat([
          "rounded-xl",
          "shadow-2xl",
          "shadow-zinc-900/20",
          "border",
          "border-neutral-800",
        ]);

        // Add caption if alt text is provided
        if (img.properties.alt) {
          let altText = img.properties.alt;
          let figureId = null;
          const match = altText.match(/\{#([^}]+)\}/);
          if (match) {
            figureId = match[1];
            altText = altText.replace(match[0], "").trim();
            img.properties.alt = altText;
            node.properties.id = figureId;
          }

          node.children.push({
            type: "element",
            tagName: "figcaption",
            properties: {
              className: [
                "text-center",
                "text-sm",
                "text-neutral-500",
                "mt-4",
                "italic",
                "max-w-2xl",
              ],
            },
            children: [{ type: "text", value: altText }],
          });
        }
      }
    });
  };
}

import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
  site: "https://iamPiyushKrSingh.github.io",
  integrations: [
    astroExpressiveCode({
      themes: ["dracula"],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        wrap: true,
        showLineNumbers: true,
      },
      styleOverrides: {
        codeBackground: "#1e1e1e",
        frames: {
          editorBackground: "#1e1e1e",
          editorTabBarBackground: "#1e1e1e",
          editorActiveTabBackground: "#1e1e1e",
          terminalTitlebarBackground: "#1e1e1e",
          terminalBackground: "#1e1e1e",
          editorTabBarBorderBottomColor: "#262626",
          terminalTitlebarBorderBottomColor: "#262626",
          editorActiveTabBorderColor: "#262626",
        },
        codeFontSize: "1rem", // Increased font size
        codeFontFamily:
          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        codePaddingBlock: "0.75rem",
        codePaddingInline: "1rem",
        uiPaddingBlock: "0.2rem",
        uiPaddingInline: "1rem",
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkAutoLinkRefs, remarkMathFencedBlock, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { output: "html" }],
      rehypeSlug,
      rehypeImagesToFigure,
      rehypeAutoRefs,
      astroFrontmatterToRehypeCitation,
      [
        rehypeCitation,
        { path: process.cwd(), linkCitations: true, csl: "ieee.csl" },
      ],
    ],
  },
});

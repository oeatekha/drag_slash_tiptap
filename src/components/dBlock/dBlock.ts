// Copyright (C) Jeet Ajaybhai Mandaliya - All Rights Reserved
// Unauthorized copying of this file or any file in notitap-pro(this project - https://github.com/sereneinserenade/notitap-pro), via any medium is strictly prohibited
// Proprietary and confidential
// Written by Jeet Ajaybhai Mandaliya <jeet.mandaliya7@gmail.com>, 17th July 2022

import { Node, mergeAttributes, Content } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { DBlockNodeView } from "./DBlockNodeView";

export interface DBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dBlock: {
      /**
       * Toggle a dBlock
       */
      setDBlock: () => ReturnType;
    };
  }
}

export const DBlock = Node.create<DBlockOptions>({
  name: "dBlock",

  priority: 1000,

  group: "dBlock",

  content: "block",

  draggable: true,

  selectable: false,

  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="d-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "d-block" }),
      0,
    ];
  },

  addCommands() {
    return {
      setDBlock:
        () =>
        ({ chain, state, commands }) => {
          const {
            selection: { $head, from, to },
            doc,
          } = state;

          const parent = $head.node($head.depth - 1);

          if (parent.type.name !== "dBlock") return false;

          let currentActiveNodeTo = -1;

          doc.descendants((node, pos) => {
            if (currentActiveNodeTo !== -1) return false;

            const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize];

            if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo;

            return false;
          });

          let textContent;

          const textOnRight = doc.textBetween(from, currentActiveNodeTo);

          if (textOnRight) {
            textContent = {
              type: "text",
              text: textOnRight,
            };
          }

          return chain()
            .focus("start")
            .insertContentAt(
              { from, to: currentActiveNodeTo },
              {
                type: this.name,
                content: [
                  {
                    type: "paragraph",
                    content: textContent ? [textContent] : [],
                  },
                ],
              }
            )
            .focus(from + 3)
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(DBlockNodeView);
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setDBlock(),
      Enter: () => this.editor.commands.setDBlock(),
    };
  },
});

import {
  EditorContent,
  useEditor,
  FloatingMenu,
  BubbleMenu
} from "@tiptap/react";
// import FloatingMenu from "@tiptap/extension-floating-menu";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Commands from "./suggestion/commands";
import getSuggestionItems from "./suggestion/suggestion";
//import renderItems from "./suggestion/renderItems";

import Document from "@tiptap/extension-document";

import { DBlock } from "./dBlock";

import "./Tiptap.css";

// doc (
//   dBlock(
//     block(paragraph|heading|blockquote)
//   )
//   dBlock(
//     block(paragraph|heading|blockquote)
//   )
//   dBlock(
//     block(paragraph|heading|blockquote)
//   )
// )

const CustomDocument = Document.extend({
  content: "dBlock+"
});

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "editor-image"
        }
      }),
      StarterKit.configure({
        document: false,
        heading: {
          HTMLAttributes: {
            class: "editor-child"
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: "editor-child"
          }
        }
      }),
      Commands.configure({
        suggestion: {
          items: getSuggestionItems
          //render: renderItems
        }
      }),
      CustomDocument,
      //Commands,
      DBlock,
      FloatingMenu,
      BubbleMenu
    ],
    content: "Type / for commands",
    // content: {
    //   type: 'dBlock',
    //   content: [{
    //     type: 'paragraph',
    //     text: 'This is an example of draggable blocks with tiptap and react'
    //   }]
    // },
    autofocus: "end"
  });

  const addImage = () => {
    let url = window.prompt("URL");

    if (!url) {
      url = "";
    }
    // editor
    //   .chain()
    //   .insertContent(`<img src="${url}"/>`)
    //   .lift("image")
    //   .insertContent("<p></p>")
    //   .focus("end")
    //   .run();
    console.log("boom");
  };

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            strike
          </button>
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            h1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            h2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            bullet list
          </button>
        </FloatingMenu>
      )}
      <EditorContent editor={editor} />{" "}
    </>
  );
};

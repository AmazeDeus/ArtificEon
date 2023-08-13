import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);

import "react-quill/dist/quill.snow.css";
import defaultClasses from "./RichEditor.module.css";

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "align",
  "indent",
  "link",
  "image",
  "video",
];

function QuillEditor({
  socket,
  documentId,
  quillLoaded,
  quillRef,
  quillImageCallback,
  content,
  onInit
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkQuillRef = async () => {
        while (!quillRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      };
      checkQuillRef();
      onInit();
    }
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        handlers: {
          image: quillImageCallback,
        },
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video", "blockquote", "code-block"],
          [
            { color: [] },
            { background: [] },
            "clean",
            { script: "sub" },
            { script: "super" },
          ],
        ],
      },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
    }),
    [socket, documentId, quillLoaded] // Required for socket to become defined in the image handler to emit the added image.
  );

  return (
    <ReactQuill
      className={`${defaultClasses["richEditor__wrapper-default_editor"]}`}
      modules={modules}
      placeholder={"Write here..."}
      value={content}
      formats={formats}
      forwardedRef={quillRef}
      theme="snow"
    />
  );
}

export default QuillEditor;

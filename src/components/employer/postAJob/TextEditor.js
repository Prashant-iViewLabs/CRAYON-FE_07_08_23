import { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import locale from "../../../i18n/locale";
import Paper from "@mui/material/Paper";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const customStyle = `
    .public-DraftStyleDefault-block {
      margin: 0;
    }
  `;

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "25px",
  boxShadow:
    "0px 1px 4px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.02), 0px 1px 12px rgba(0, 0, 0, 0.12)",
  minHeight: "133px",
  padding: "16px",
  ".toolbar-class": {
    border: 0,
    marginLeft: "-10px",
    ".rdw-option-wrapper": {
      border: 0,
    },
    ".rdw-dropdown-wrapper": {
      border: 0,
    },
  },
}));
const toolBarOptions = {
  options: [
    "inline",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "remove",
    "history",
  ],
  inline: {
    options: ["italic", "bold", "underline", "strikethrough"],
  },
  list: {
    options: ["unordered", "ordered"],
  },
  textAlign: {
    options: ["left", "center", "right", "justify"],
  },
};

const getRGBValues = (text) => {
  const rgbValues = text.match(/\((.*?)\)/)[1].split(",");
  const color = `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
  return color;
};
const styleToHTML = (style) => {
  if (style === "BOLD") {
    return <strong />;
  }
  if (style === "ITALIC") {
    return <em />;
  }
  if (style === "UNDERLINE") {
    return <u />;
  }
  if (style === "STRIKETHROUGH") {
    return <del />;
  }
  if (style.includes("bgcolor-rgb")) {
    let bgcolor = getRGBValues(style);
    return <span style={{ background: bgcolor }} />;
  }
  if (style.includes("color-rgb")) {
    let color = getRGBValues(style);
    return <span style={{ color }} />;
  }
  return undefined;
};

const blockToHTML = (block) => {
  const textAlign = block.data && block.data["text-align"];

  const TagName =
    block.type === "unordered-list-item"
      ? "ul"
      : block.type === "ordered-list-item"
      ? "ol"
      : "p";
  if (textAlign) {
    if (block.type === "unstyled") {
      return <p style={{ textAlign }} />;
    }
    return (
      <TagName>
        <li style={{ textAlign }}>{block.text}</li>
      </TagName>
    );
  }
};

const entityToHTML = (entity, originalText) => {
  if (entity.type === "LINK") {
    return (
      <a
        href={entity.data["url"]}
        target={entity.data["targetOption"]}
        rel="noopener noreferrer"
      >
        {originalText}
      </a>
    );
  }

  return originalText;
};
const options = {
  blockToHTML,
  styleToHTML,
  entityToHTML,
};

export default function TextEditor({ value, type, title, onInputCHange }) {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const blocksFromHTML = convertFromHTML(value);
      const content = ContentState?.createFromBlockArray(
        blocksFromHTML?.contentBlocks,
        blocksFromHTML?.entityMap
      );
      return EditorState.createWithContent(content);
    }
    return EditorState.createEmpty();
  });
  const [convertedContent, setConvertedContent] = useState("");

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const html = convertToHTML(options)(editorState.getCurrentContent());
    setConvertedContent(html);
    onInputCHange(html, type);
  };

  useEffect(() => {
    // This effect will update the initial value on component mount
    console.log(value);
    if ((value && !convertedContent) || value !== convertedContent) {
      const blocksFromHTML = convertFromHTML(value === null ? "" : value);
      const content = ContentState?.createFromBlockArray(
        blocksFromHTML?.contentBlocks,
        blocksFromHTML?.entityMap
      );
      setEditorState(EditorState.createWithContent(content));
      setConvertedContent(value);
    }
  }, [value, convertedContent]);

  return (
    <StyledPaper>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 400,
        }}
      >
        {title}
      </Typography>
      <style>{customStyle}</style>
      <Editor
        // editorState={editorState}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder="Write here..."
        toolbar={toolBarOptions}
        ref={editorRef}
      />
    </StyledPaper>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, Code, Heading1 } from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "开始撰写你的杰作...",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        // Tailwind Typography 样式
        class:
          "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[440px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
      {/* 简单的 Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-neutral-800 bg-neutral-900">
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold className="w-4 h-4" />}
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic className="w-4 h-4" />}
        />
        <div className="w-px h-4 bg-neutral-800 mx-2" />
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading1 className="w-4 h-4" />}
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<List className="w-4 h-4" />}
        />
        <ToolButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={<Code className="w-4 h-4" />}
        />
      </div>

      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

// 工具栏按钮组件
const ToolButton = ({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-neutral-800 transition-colors ${
      isActive ? "text-lime-400 bg-neutral-800" : "text-neutral-400"
    }`}
  >
    {icon}
  </button>
);

export default TiptapEditor;

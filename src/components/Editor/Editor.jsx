import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

export default function Editor({ content }) {
  const editor = useEditor({
    extensions: [
      Link,
      Image.configure({
        allowBase64: true,
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: content,
  });
  useEffect(() => {
    editor?.commands.setContent(content);
  }, [editor, content]);
  return (
    <EditorContent editor={editor} />
  )
}
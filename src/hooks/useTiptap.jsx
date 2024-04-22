import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import { useState } from 'react';

export function useTiptap() {
  const [edit, setEdit] = useState(false),
    [article, setArticle] = useState({}),
    editor = useEditor({
      extensions: [
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link,
        Underline,
        Placeholder.configure({
          placeholder: 'Good writing :)',
        }),
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
      content: article?.content,
      editable: edit,
    });
  return [edit, setEdit, article, setArticle, editor];
};

import ColorButton from '../ColorButton/ColorButton';
import FormatButton from '../FormatButton/FormatButton';
import styles from './Toolbar.module.scss';

export default function Toolbar({ editor, setIsOpenLink }) {
  return (
    <div className={styles.toolbar}>
      <FormatButton
        icon='undo'
        onClick={() => editor?.commands.undo()}
        disabled={!editor?.can().undo()}
      />
      <FormatButton
        icon='redo'
        onClick={() => editor?.commands.redo()}
        disabled={!editor?.can().redo()}
      />
      <div className={styles.divider}></div>
      <div
        className={styles.dropdown_format}
        onClick={(e) => {
          if (e.currentTarget === document.activeElement)
            e.currentTarget.removeAttribute('tabindex');
          else {
            e.currentTarget.setAttribute('tabindex', -1);
            e.currentTarget.focus();
          }
        }}
        onBlur={(e) => e.currentTarget.removeAttribute('tabindex')}
      >
        <FormatButton
          icon={
            editor?.isActive('heading', { level: 1 })
              ? 'format_h1'
              : editor?.isActive('heading', { level: 2 })
              ? 'format_h2'
              : editor?.isActive('heading', { level: 3 })
              ? 'format_h3'
              : editor?.isActive('heading', { level: 4 })
              ? 'format_h4'
              : editor?.isActive('heading', { level: 5 })
              ? 'format_h5'
              : editor?.isActive('heading', { level: 6 })
              ? 'format_h6'
              : 'format_paragraph'
          }
          dropDown
        />
        <div className={`${styles.menu} ${styles.left_align}`}>
          <FormatButton
            icon='format_paragraph'
            onClick={() =>
              editor?.isActive('heading', { level: 1 })
                ? editor.chain().focus().toggleHeading({ level: 1 }).run()
                : editor?.isActive('heading', { level: 2 })
                ? editor.chain().focus().toggleHeading({ level: 2 }).run()
                : editor?.isActive('heading', { level: 3 })
                ? editor.chain().focus().toggleHeading({ level: 3 }).run()
                : editor?.isActive('heading', { level: 4 })
                ? editor.chain().focus().toggleHeading({ level: 4 }).run()
                : editor?.isActive('heading', { level: 5 })
                ? editor.chain().focus().toggleHeading({ level: 5 }).run()
                : editor?.isActive('heading', { level: 6 }) &&
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            active={!editor?.isActive('heading')}
          />
          <FormatButton
            icon='format_h1'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor?.isActive('heading', { level: 1 })}
          />
          <FormatButton
            icon='format_h2'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor?.isActive('heading', { level: 2 })}
          />
          <FormatButton
            icon='format_h3'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor?.isActive('heading', { level: 3 })}
          />
          <FormatButton
            icon='format_h4'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            active={editor?.isActive('heading', { level: 4 })}
          />
          <FormatButton
            icon='format_h5'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            active={editor?.isActive('heading', { level: 5 })}
          />
          <FormatButton
            icon='format_h6'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            active={editor?.isActive('heading', { level: 6 })}
          />
        </div>
      </div>
      <div className={styles.divider}></div>
      <FormatButton
        icon='format_bold'
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor?.isActive('bold')}
      />
      <FormatButton
        icon='format_italic'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor?.isActive('italic')}
      />
      <FormatButton
        icon='format_underlined'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor?.isActive('underline')}
      />
      <div
        className={styles.dropdown_format}
        onClick={(e) => {
          if (e.currentTarget === document.activeElement)
            e.currentTarget.removeAttribute('tabindex');
          else {
            e.currentTarget.setAttribute('tabindex', -1);
            e.currentTarget.focus();
          }
        }}
        onBlur={(e) => e.currentTarget.removeAttribute('tabindex')}
      >
        <FormatButton icon='format_color_text' />
        <div
          className={styles.color_indicator}
          style={{
            background: editor.isActive('textStyle', {
              color: 'var(--on-surface-variant)',
            })
              ? 'var(--on-surface-variant)'
              : editor.isActive('textStyle', {
                  color: 'var(--primary)',
                }) || editor.isActive('link')
              ? 'var(--primary)'
              : editor.isActive('textStyle', {
                  color: 'var(--green)',
                })
              ? 'var(--green)'
              : editor.isActive('textStyle', {
                  color: 'var(--error)',
                })
              ? 'var(--error)'
              : 'var(--on-surface)',
          }}
        ></div>
        <div className={styles.menu}>
          <ColorButton color='on-surface' editor={editor} />
          <ColorButton color='on-surface-variant' editor={editor} />
          <ColorButton color='primary' editor={editor} />
          <ColorButton color='green' editor={editor} />
          <ColorButton color='error' editor={editor} />
        </div>
      </div>
      <div className={styles.divider}></div>
      <FormatButton
        icon='format_list_bulleted'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor?.isActive('bulletList')}
      />
      <div className={styles.divider}></div>
      <div
        className={styles.dropdown_format}
        onClick={(e) => {
          if (e.currentTarget === document.activeElement)
            e.currentTarget.removeAttribute('tabindex');
          else {
            e.currentTarget.setAttribute('tabindex', -1);
            e.currentTarget.focus();
          }
        }}
        onBlur={(e) => e.currentTarget.removeAttribute('tabindex')}
      >
        <FormatButton
          icon={
            editor?.isActive({ textAlign: 'center' })
              ? 'format_align_center'
              : editor?.isActive({ textAlign: 'right' })
              ? 'format_align_right'
              : editor?.isActive({ textAlign: 'justify' })
              ? 'format_align_justify'
              : 'format_align_left'
          }
          dropDown
        />
        <div className={styles.menu}>
          <FormatButton
            icon='format_align_left'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor?.isActive({ textAlign: 'left' })}
          />
          <FormatButton
            icon='format_align_center'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor?.isActive({ textAlign: 'center' })}
          />
          <FormatButton
            icon='format_align_right'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor?.isActive({ textAlign: 'right' })}
          />
          <FormatButton
            icon='format_align_justify'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor?.isActive({ textAlign: 'justify' })}
          />
        </div>
      </div>
      <div className={styles.divider}></div>
      <FormatButton
        icon='code'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor?.isActive('codeBlock')}
      />
      <FormatButton
        icon='format_quote'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor?.isActive('blockquote')}
      />
      <div
        className={styles.divider}
        onClick={() => console.log(setIsOpenLink)}
      ></div>
      <FormatButton icon='image' />
      <FormatButton icon='link' onClick={() => setIsOpenLink(true)} />
    </div>
  );
}

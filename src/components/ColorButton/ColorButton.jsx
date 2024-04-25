import styles from './ColorButton.module.scss';

export default function ColorButton({ color, editor }) {
  return (
    <div
      // className={`material-symbols-outlined ${styles.color_button} ${
      //   color === 'on-surface'
      //     ? !editor?.isActive('textStyle') && styles.active
      //     : editor?.isActive('textStyle', { color: `var(--${color})` }) && styles.active
      // }`}
      // style={{
      //   background: `var(--${color})`,
      //   color: `var(--surface)`,
      // }}
      className={`material-symbols-outlined ${styles.color_button} ${
        color === 'on-surface' && !editor?.isActive('textStyle')
          ? styles.active
          : color !== 'on-surface' &&
            editor?.isActive('textStyle', { color: `var(--${color})` })
          ? styles.active
          : undefined
      }`}
      style={{
        background: `var(--${color})`,
        color: `var(--surface)`,
      }}
      onClick={() => {
        if (color === 'on-surface') {
          editor?.commands.unsetColor();
        } else editor.chain().focus().setColor(`var(--${color})`).run();
      }}
    ></div>
  );
}

import css from './DropZone.css';

export const DropZone = ({ children }) => {
  return (
    <div className={css.dropZone}>
      {children}
    </div>
  );
};

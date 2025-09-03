import css from './DropZone.css';

const DropZone = ({ children }) => {
  return (
    <div className={css.dropZone}>
      {children}
    </div>
  );
};

export default DropZone;

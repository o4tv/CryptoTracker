const ConvertButton = ({
  toggle,
  children,
}: {
  toggle: () => void;
  children: string;
}) => {
  return (
    <button type="button" onClick={toggle}>
      {children}
    </button>
  );
};

export default ConvertButton;

interface Props {
  className?: string;
}
const Spinner: React.FC<Props> = ({ className = "w-3 h-3" }) => {
  return <div className={`spinner ${className}`}></div>;
};

export default Spinner;

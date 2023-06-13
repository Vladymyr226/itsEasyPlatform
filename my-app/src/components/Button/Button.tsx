import s from "./Button.module.css";

interface ButtonProps {
  text: string;
  handleClick?: () => void;
}

const Button = ({ text, handleClick }: ButtonProps) => {
  return (
    <button onClick={handleClick} className={s.button}>
      {text}
    </button>
  );
};

export default Button;

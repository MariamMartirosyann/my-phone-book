import { Button, LinearProgress } from "@mui/material";
import { memo } from "react";

interface IButtonProps {
  color?: any;
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading: boolean;
  variant?: "contained" | "text" | "outlined";
  children: JSX.Element;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick: () => void;
  form?: string;
}

const ButtonLoader = ({
  color,
  disabled,
  fullWidth,
  isLoading,
  children,
  type,
  className,
  onClick,
  variant = "contained",
  form,
}: IButtonProps): JSX.Element => {


 
  
  return (
    
    <Button
      form={form}
      color={color}
      variant={variant}
      className={`${className}`}
      disabled={isLoading || disabled}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
  
    >
      {children}

      {isLoading && <LinearProgress color={color} />}
    </Button>
  );
};

ButtonLoader.defaultProps = {
  color: "primary",
  variant: "contained",
};
export default memo(ButtonLoader);

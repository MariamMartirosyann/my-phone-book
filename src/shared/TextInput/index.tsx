import { InputAdornment, TextField } from "@mui/material";
import { Fragment, useCallback, KeyboardEvent, Ref, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CrossIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface IInputProps {
  size?: "small" | "medium";
  name: string;
  multiline?: boolean;
  label: string;
  placeholder?: string;
  isSecure?: boolean;
  type?: string;
  clearable?: boolean;
  rules?: any;
  onClear?: () => void;
  onKeyPress?: (parameter: KeyboardEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  customError?: string;
}

const InputField = ({
  size,
  name,
  label,
  placeholder = "",
  type,
  multiline = false,
  clearable = false,
  rules,
  isSecure = false,
  onKeyPress,
  onClear,
  inputRef,
  disabled,
  customError = "",
}: IInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [invisible, setVisible] = useState(true);

  const handleClearInput = (field: any) => {
    field.onChange((e: any) => (field.value = ""));
    onClear?.();
  };

  const toggleVisible = () => {
    setVisible(!invisible);
  };

  const getEndAdornment = (field: any) => {
    if (clearable) {
      return (
        <InputAdornment
          position={"end"}
          onClick={() => handleClearInput(field)}
        >
          <div style={{ cursor: "pointer" }}>
            <CrossIcon />
          </div>
        </InputAdornment>
      );
    } else if (isSecure) {
      return (
        <InputAdornment position={"end"} onClick={toggleVisible}>
          <div style={{ cursor: "pointer" }}>
            {invisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </div>
        </InputAdornment>
      );
    }
  };

  const errorInfo = useCallback(() => {
    return errors?.[name];
  }, [errors, name]);

  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <TextField
            {...field}
            size={size}
            inputRef={inputRef}
            value={field.value ?? ""}
            placeholder={placeholder}
            error={customError ? !!customError : !!errorInfo?.()}
            helperText={
              customError ? customError : !!errorInfo()?.message?.toString()
            }
            fullWidth
            type={invisible && isSecure ? "password" : type || "text"}
            label={label}
            multiline={multiline}
            variant="outlined"
            disabled={disabled}
            InputProps={{
              endAdornment: getEndAdornment(field),
            }}
            onKeyPress={onKeyPress}
          />
        )}
      />
    </Fragment>
  );
};

export default InputField;

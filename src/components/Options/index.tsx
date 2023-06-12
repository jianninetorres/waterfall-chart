import { Option } from "@/interfaces";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { SetStateAction } from "react";

interface OptionsProps {
  title: string;
  value: any;
  list: Option[];
  onChangeHandler: React.Dispatch<SetStateAction<any>>;
}

const Options = ({ title, value, list, onChangeHandler }: OptionsProps) => {
  return (
    <FormControl>
      <h2>{title}</h2>
      <RadioGroup
        aria-labelledby="controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChangeHandler(event.target.value)
        }
      >
        {list.map((option) => (
          <FormControlLabel
            value={option.name}
            control={<Radio />}
            label={option.label}
            key={option.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default Options;

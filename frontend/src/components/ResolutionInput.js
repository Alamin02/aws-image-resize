import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export default function RadioButtonsGroup({ value, onChange }) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Resolution</FormLabel>
      <RadioGroup
        aria-label="resolution"
        name="resolution"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel
          value="resolution-1"
          control={<Radio />}
          label="640×480"
        />
        <FormControlLabel
          value="resolution-2"
          control={<Radio />}
          label="1280×800"
        />
        <FormControlLabel
          value="resolution-3"
          control={<Radio />}
          label="1024×576"
        />
      </RadioGroup>
    </FormControl>
  );
}

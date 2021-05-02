import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export default function RadioButtonsGroup({ value, onChange }) {
  const resolutions = ["640×480", "1280×800", "1024×576"];

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Resolution</FormLabel>
      <RadioGroup
        aria-label="resolution"
        name="resolution"
        value={value}
        onChange={onChange}
      >
        {resolutions.map((resolution) => (
          <FormControlLabel
            key={resolution}
            value={resolution}
            control={<Radio />}
            label={resolution}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

RadioButtonsGroup.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

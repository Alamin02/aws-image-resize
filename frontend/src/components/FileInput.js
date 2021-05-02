import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

import ImageIcon from "@material-ui/icons/Image";

function FileInput({ onChange }) {
  return (
    <Button
      component="label"
      startIcon={<ImageIcon />}
      size="medium"
      color="primary"
      variant="contained"
    >
      Select Images
      <input
        onChange={onChange}
        type="file"
        id="myfile"
        name="myfile"
        multiple
        accept="image/png,image/jpeg"
        hidden
      ></input>
    </Button>
  );
}

FileInput.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FileInput;

function FileInput({ onChange }) {
  return (
    <input
      onChange={onChange}
      type="file"
      id="myfile"
      name="myfile"
      multiple
      accept="image/png,image/jpeg"
    ></input>
  );
}

export default FileInput;

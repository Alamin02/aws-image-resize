import { useState, useEffect } from "react";
import shortid from "shortid";

import { Container, Typography, Box, Button } from "@material-ui/core";
import CropIcon from "@material-ui/icons/Crop";
import { makeStyles } from "@material-ui/core/styles";

import { FileInput, ResolutionInput, Status, Message } from "./components";

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 30,
    marginBottom: 30,
  },
  inputField: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("USER_ID"));
  const [status, setStatus] = useState([]);
  const [resolution, setResolution] = useState("resolution-1");
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);

  const [success, setSuccess] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);

  const classes = useStyles();

  const fetchProcessingStatus = async (userId) => {
    return fetch(`http://localhost:4000/api/v1/images/${userId}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setStatus(data);
      })
      .catch(() => {
        setError("Could not fetch status");
      });
  };

  useEffect(() => {
    if (!userId) {
      const generatedUserId = shortid.generate();
      localStorage.setItem("USER_ID", generatedUserId);
      setUserId(generatedUserId);
    } else {
      fetchProcessingStatus(userId);
      setInterval(() => fetchProcessingStatus(userId), 5000);
    }
  }, [userId]);

  const showSuccess = (successMsg) => {
    setSuccess(successMsg);
    setSuccessAlert(true);
  };

  const hideSuccess = () => {
    setSuccess("");
    setSuccessAlert(false);
  };

  const showError = (errorMsg) => {
    setError(errorMsg);
    setErrorAlert(true);
  };

  const hideError = () => {
    setError("");
    setErrorAlert(false);
  };

  const uploadFiles = (files) => {
    const formData = new FormData();
    formData.append("userId", userId);

    files.forEach((file) => {
      formData.append("images", file);
    });

    return fetch(`http://localhost:4000/api/v1/images/`, {
      method: "post",
      body: formData,
    });
  };

  const handleSetResolution = (event) => {
    setResolution(event.target.value);
  };

  const handleFileInput = async (e) => {
    const inputFiles = e.target.files || [];

    if (inputFiles.length > 5) {
      setError("You can add max 5 images");
    } else {
      // uploadFiles([...inputFiles]).then(() => {
      //   fetchProcessingStatus(userId);
      // });
    }
  };

  return (
    <Container>
      <Typography variant="h2" className={classes.header} gutterBottom>
        Image Resize Project
      </Typography>

      <Box className={classes.inputField}>
        <FileInput onChange={handleFileInput} />
      </Box>

      <Box className={classes.inputField}>
        <ResolutionInput value={resolution} onChange={handleSetResolution} />
      </Box>

      <Box className={classes.inputField}>
        <Button variant="contained" startIcon={<CropIcon />}>
          Resize
        </Button>
      </Box>

      <Status status={status} />

      <Message
        open={successAlert}
        handleClose={hideSuccess}
        message={success}
        severity="success"
      />
      <Message
        open={errorAlert}
        handleClose={hideError}
        message={error}
        severity="error"
      />
    </Container>
  );
}

export default App;

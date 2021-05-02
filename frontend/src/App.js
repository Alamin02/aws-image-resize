import { useState, useEffect } from "react";
import shortid from "shortid";

import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@material-ui/core";
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
  // Form input data
  const [userId, setUserId] = useState(localStorage.getItem("USER_ID"));
  const [resolution, setResolution] = useState("640×480");
  const [images, setImages] = useState([]);

  // Fetched data from server
  const [status, setStatus] = useState([]);

  // Alerts
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [success, setSuccess] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const classes = useStyles();

  const fetchProcessingStatus = async (userId) => {
    return fetch(`http://localhost:4000/api/v1/images/${userId}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setStatus(data);
      })
      .catch(() => {
        showError("Could not fetch status");
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

  const uploadFiles = async () => {
    if (images.length === 0) {
      showError("Select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("resolution", resolution);

    images.forEach((file) => {
      formData.append("images", file);
    });

    setImages([]);
    setIsUploading(true);

    return fetch(`http://localhost:4000/api/v1/images/`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ msg, error }) => {
        setIsUploading(false);
        if (error) {
          showError(error);
        } else {
          showSuccess(msg);
        }
      })
      .catch(() => {
        setIsUploading(true);
        showError("Could not upload image");
      });
  };

  const handleSetResolution = (event) => {
    setResolution(event.target.value);
  };

  const handleFileInput = async (e) => {
    const inputFiles = e.target.files || [];

    if (inputFiles.length > 5) {
      showError("You can add maximum 5 images at once");
      setImages([]);
    } else {
      setImages([...inputFiles]);
    }
  };

  return (
    <Container>
      <Typography variant="h2" className={classes.header} gutterBottom>
        Image Resize Project
      </Typography>

      <Box className={classes.inputField}>
        <FileInput onChange={handleFileInput} />
        <Typography>Selected {images.length} images</Typography>
      </Box>

      <Box className={classes.inputField}>
        <ResolutionInput value={resolution} onChange={handleSetResolution} />
      </Box>

      <Box className={classes.inputField}>
        <Button
          variant="contained"
          onClick={uploadFiles}
          startIcon={
            isUploading ? <CircularProgress size="1rem" /> : <CropIcon />
          }
          disabled={isUploading}
        >
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

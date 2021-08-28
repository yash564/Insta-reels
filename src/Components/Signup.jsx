import React, { useContext, useState } from "react";
import { firebaseDB, firebaseStorage } from "../config/firebase";
import { AuthContext } from "../context/AuthProvider";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";

const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const { signUp } = useContext(AuthContext);

  const handleSignUp = async () => {
    try {
      let response = await signUp(email, password);
      let uid = response.user.uid;
      const uploadPhotoObject = firebaseStorage
        .ref(`/profilePhotos/${uid}/image.jpg`)
        .put(profileImage);
      uploadPhotoObject.on("state_changed", fun1, fun2, fun3);
      // to track the progress of upload
      function fun1(snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      }
      // it indicates error while uploading
      function fun2(error) {
        console.log(error);
      }
      // it indicates success of the upload
      async function fun3() {
        let profileImageUrl =
          await uploadPhotoObject.snapshot.ref.getDownloadURL();
        await firebaseDB.collection("user").doc(uid).set({
          email: email,
          userId: uid,
          username: username,
          profileImageUrl: profileImageUrl,
          postsCreated: [],
        });
        props.history.push("/");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleFileSubmit = (e) => {
    let fileObject = e.target.files[0];
    setProfileImage(fileObject);
  };

  let useStyles = makeStyles({
    centerDivs: {
      display: "flex",
      flexDirection: "column",
    },
    center: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    padding:{
      paddingBottom:"0.5rem",
      paddingTop:"0.5rem"
    },
    fullWidth:{
      width:"100%",
    },
    mb:{
      marginBottom:"0.7rem"
    }
  });
  let classes = useStyles();

  return (
    <div>
      <Grid container className={classes.center}>
        <Grid item>
          <Card variant="outlined" style={{width:"30vw"}} className={classes.mb}>
            <CardMedia
              image={logo}
              style={{ height: "6rem", backgroundSize: "contain" }}
            ></CardMedia>
            <CardContent className={classes.centerDivs}>
              <Typography variant="p" className={classes.mb} style={{textAlign:"center"}}>
                Sign up to see photos and videos from your friends
              </Typography>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                variant="outlined"
                className={classes.mb}
              ></TextField>
              <TextField
                label="Email"
                value={email}
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                variant="outlined"
                className={classes.mb}
              ></TextField>
              <TextField
                label="Password"
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                variant="outlined"
                className={classes.mb}
              ></TextField>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload></CloudUpload>}
                color="secondary"
              >
                Upload Profile Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileSubmit(e);
                  }}
                  hidden
                ></input>
              </Button>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                className={classes.fullWidth}
              >
                SignUp
              </Button>
            </CardActions>
            <CardContent style={{display:"flex"}}>
              <Typography variant="p" style={{textAlign:"center"}}>
                By signing up, you agree to our Terms, Data Policy and Cookies Policy.
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.padding} style={{textAlign:"center",display:"flex",flexDirection:"column"}}>
            <Typography variant="p">Have an account? <Button variant="contained" color="primary"><Link style={{color:"white" ,textDecoration:"none"}} to="/login">Log In</Link></Button></Typography>
            <Typography variant="p" style={{color:"red"}}>{message}</Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Signup;

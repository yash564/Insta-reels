import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import {
  TextField,
  Grid,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Container,
  CardMedia,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Insta from "../Images/insta.png";
import Img1 from "../Images/img1.jpg";
import Img2 from "../Images/img2.jpg";
import Img3 from "../Images/img3.jpg";
import Img4 from "../Images/img4.jpg";
import Img5 from "../Images/img5.jpg";
import { CarouselProvider, Slider, Slide, Image } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  let { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      props.history.push("/");
    } catch (err) {
      setMessage(err.message);
      setEmail("");
      setPassword("");
    }
  };

  const useStyles = makeStyles({
    carousal: { height: "10rem", backgroundColor: "lightgray" },
    centerDivs: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    fullWidth: {
      width: "100%",
    },
    padding: {
      paddingBottom: "0.5rem",
      paddingTop: "0.5rem",
    },
    mb: {
      marginBottom: "0.7rem",
    },
    imgcar:{
      width: "441px",
      height: "590px",
      position: "relative",
    },
    caro:{
      height: "423px",
      width: "241px",
      position: "absolute",
      left: "143px",
      top: "93px",
    }
  });

  let classes = useStyles();

  return (
    <div>
      <Container style={{ height: "100vh" }}>
        <Grid
          container
          spacing={2}
          className={classes.centerDivs}
          style={{ height: "100vh" }}
        >
          <Grid item sm={3}>
            <div
              className={classes.imgcar}
              style={{
                backgroundImage: `url(` + Insta + `)`,
                backgroundSize: "cover",
              }}
            >
              <div className={classes.caro}>
                <CarouselProvider
                  visibleSlides={1}
                  totalSlides={5}
                  step={3}
                  naturalSlideWidth={238}
                  naturalSlideHeight={423}
                  hasMasterSpinner
                  isPlaying={true}
                  infinite={true}
                  dragEnabled={false}
                  touchEnabled={false}
                >
                  <Slider>
                    <Slide index={0}>
                      <Image src={Img1}/>
                    </Slide>
                    <Slide index={1}>
                      <Image src={Img2}/>
                    </Slide>
                    <Slide index={2}>
                      <Image src={Img3}/>
                    </Slide>
                    <Slide index={3}>
                      <Image src={Img4}/>
                    </Slide>
                    <Slide index={4}>
                      <Image src={Img5}/>
                    </Slide>
                  </Slider>
                </CarouselProvider>
              </div>
            </div>
          </Grid>
          <Grid item sm={3}>
            <Card variant="outlined" className={classes.mb}>
              <CardMedia
                style={{ height: "5rem", backgroundSize: "contain" }}
                image={logo}
              ></CardMedia>
              <CardContent className={classes.centerElements}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  variant="outlined"
                  className={classes.mb}
                ></TextField>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  variant="outlined"
                ></TextField>
              </CardContent>
              <CardActions>
                <Button
                  className={classes.fullWidth}
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
            <Card
              variant="outlined"
              className={classes.padding}
              style={{ textAlign: "center" }}
            >
              <Typography>
                Don't have an account?{" "}
                <Button variant="contained" color="primary">
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                    to="/signup"
                  >
                    SignUp
                  </Link>
                </Button>
              </Typography>
              <Typography variant="p" style={{ color: "red" }}>
                {message}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;

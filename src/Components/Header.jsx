import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  CardMedia,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import HomeIcon from "@material-ui/icons/Home";
import Instagram from "../Images/Instagram.JPG";
import { useHistory } from "react-router-dom";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { AuthContext } from "../context/AuthProvider";

const Header = () => {
  const { signOut, currentUser } = useContext(AuthContext);
  const history = useHistory();

  const useStyle = makeStyles({
    logo: {
      width: "15%",
      height: "36px",
      backgroundSize: "contain",
      marginRight: "65vw",
    },
  });
  let classes = useStyle();

  // const handleInputFile = (e) => {
  //   let fileObject = e.target.files[0];
  //   setVideoFile(fileObject);
  // };

  const handleHome = () => {
    history.push("/");
  };

  const handleProfile = () => {
    history.push(`/profile/${currentUser.uid}`);
  };

  const handleLogOut = async () => {
    try {
      await signOut();
      history.push("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <AppBar color="white" style={{ position: "static" }}>
        <Toolbar>
          <CardMedia image={Instagram} className={classes.logo}></CardMedia>
          <HomeIcon
            style={{ marginRight: "1.5vw" }}
            onClick={handleHome}
          ></HomeIcon>
          {/* <AddPhotoAlternateIcon
            style={{ marginRight: "1.5vw" }}
            component="label"
          >
            <input
              type="file"
              onChange={(e) => {
                handleInputFile(e);
              }}
              style={{display:"none"}}
            />
          </AddPhotoAlternateIcon> */}
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <AccountCircle {...bindTrigger(popupState)}>
                  {" "}
                  Open Menu
                </AccountCircle>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;

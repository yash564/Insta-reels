import {
  Container,
  Card,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  CardMedia,
  CardActions,
  TextField,
  Button,
  CardContent,
  Modal,
  makeStyles,
  Divider,
} from "@material-ui/core";
import ReactDOM from "react-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase";
import { firebaseDB, firebaseStorage } from "../config/firebase";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { AuthContext } from "../context/AuthProvider";

const VideoPost = (props) => {
  const [user, setUser] = useState(null);
  const [comments, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(null);
  const [openModal, setopenModal] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const useStyle = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
    },
    modal:{
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
    }
  }));
  let classes = useStyle();

  const handleComment = async () => {
    let photo;
    let name;
    let uid = currentUser.uid;
    if (uid == user.userId) {
      photo = user.profileImageUrl;
      name = user.username;
    } else {
      let userDoc = await firebaseDB.collection("user").doc(uid).get();
      let commentUserPic = userDoc.data();
      photo = commentUserPic.profileImageUrl;
      name = commentUserPic.username;
    }
    let newCommentList = [
      ...commentList,
      { profilePic: photo, comment: comments, userName: name },
    ];
    let doc = await firebaseDB.collection("posts").doc(props.postObj.pid);
    doc.update({
      Comments: firebase.firestore.FieldValue.arrayUnion({
        comment: comments,
        uid: uid,
      }),
    });
    setCommentList(newCommentList);
    setComment("");
  };

  useEffect(async () => {
    let uid = props.postObj.uid;
    let document = await firebaseDB.collection("user").doc(uid).get();
    let user = document.data();
    let comments = props.postObj.Comments;
    let likes = props.postObj.Likes;
    let updatedCommentList = [];
    for (let i = 0; i < comments.length; i++) {
      let commentObj = comments[i];
      let doc = await firebaseDB.collection("user").doc(commentObj.uid).get();
      let commentUserPic = doc.data().profileImageUrl;
      let commentUserName = doc.data().username;
      updatedCommentList.push({
        profilePic: commentUserPic,
        comment: commentObj.comment,
        userName: commentUserName,
      });
    }

    if (likes.includes(currentUser.uid)) {
      setIsLiked(true);
      setLikesCount(likes.length);
    } else {
      if (likes.length) {
        setLikesCount(likes.length);
      }
    }

    setUser(user);
    setCommentList(updatedCommentList);
  }, []);

  const handleColor = async () => {
    if (isLiked == true) {
      let postDoc = props.postObj;
      let filteredLikes = postDoc.Likes.filter((uid) => {
        return uid !== currentUser.uid;
      });
      postDoc.Likes = filteredLikes;
      await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
      setIsLiked(false);
      likesCount == 1 ? setLikesCount(null) : setLikesCount(likesCount - 1);
    } else {
      let postDoc = props.postObj;
      postDoc.Likes.push(currentUser.uid);
      await firebaseDB.collection("posts").doc(postDoc.pid).set(postDoc);
      setIsLiked(true);
      likesCount == null ? setLikesCount(1) : setLikesCount(likesCount + 1);
    }
  };

  const handleOpen = () => {
    setopenModal(true);
  };

  const handleClose = () => {
    setopenModal(false);
  };

  const body = (
    <div className={classes.paper}>
      <CardHeader
        avatar={<Avatar src={user ? user.profileImageUrl : ""}></Avatar>}
        title={user ? user.username : ""}
        action={
          <IconButton>
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
        }
      ></CardHeader>
      <Divider></Divider>
      {commentList.map((commentObj) => {
        return (
          <CardContent style={{ display: "flex" }}>
            <Avatar src={commentObj.profilePic}></Avatar>
            <Typography
              variant="p"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                marginLeft: "4px",
              }}
            >
              {commentObj.userName}
            </Typography>
            <Typography
              variant="p"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "8px",
              }}
            >
              {commentObj.comment}
            </Typography>
          </CardContent>
        );
      })}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom:"10px",
          padding:"10px",
        }}
      >
        <TextField
          variant="outlined"
          label="Add a comment"
          size="small"
          style={{ width: "80%" }}
          value={comments}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></TextField>
        <Button variant="contained" onClick={handleComment}>
          Post
        </Button>
      </div>
    </div>
  );

  return (
    //   <Container>
    <Card
      variant="outlined"
      style={{ height: "550px", width: "600px", marginBottom: "1rem" }}
    >
      <CardHeader
        avatar={<Avatar src={user ? user.profileImageUrl : ""}></Avatar>}
        title={user ? user.username : ""}
        action={
          <IconButton>
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
        }
      ></CardHeader>
      {/* <CardMedia> */}
      <div
        className="video-container"
        style={{ height: "337px", width: "100%" }}
      >
        <Video src={props.postObj.videoLink}></Video>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <CardActions onClick={handleColor}>
          {isLiked ? (
            <Favorite style={{ color: "red" }}></Favorite>
          ) : (
            <FavoriteBorder></FavoriteBorder>
          )}
        </CardActions>
        {likesCount && <Typography>{likesCount} Likes</Typography>}
      </div>
      {/* <CardContent style={{marginBottom:"0",marginTop:"0"}}> */}
      {commentList.length > 0 ? (
        <div>
          <Typography
            variant="p"
            style={{ marginLeft: "15px" }}
            onClick={handleOpen}
          >
            View all {commentList.length} comments
          </Typography>
          <Modal open={openModal} onClose={handleClose} className={classes.modal}>
            {body}
          </Modal>
        </div>
      ) : (
        <Typography variant="p"></Typography>
      )}
      {/* </CardContent> */}
      <CardContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TextField
          variant="outlined"
          label="Add a comment"
          size="small"
          style={{ width: "80%" }}
          value={comments}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        ></TextField>
        <Button variant="contained" onClick={handleComment}>
          Post
        </Button>
      </CardContent>
      {/* </CardMedia> */}
      {commentList.map((commentObj) => {
        return (
          <CardContent style={{ display: "flex" }}>
            <Avatar src={commentObj.profilePic}></Avatar>
            <Typography
              variant="p"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                marginLeft: "4px",
              }}
            >
              {commentObj.userName}
            </Typography>
            <Typography
              variant="p"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "8px",
              }}
            >
              {commentObj.comment}
            </Typography>
          </CardContent>
        );
      })}
    </Card>
    //   </Container>
  );
};

function Video(props) {
  let styles = {
    height: "100%",
    width: "100%",
  };

  const handleAutoScroll = (e) => {
    // console.log(e);
    // let next=ReactDOM.findDOMNode(e.target).parentNode.parentNode.nextSibling;
    // console.log(next);
    // if(next){
    //   next.scrollIntoView({ behaviour: "smooth" });
    // }
  };

  return (
    <video style={styles} controls muted={true} onEnded={handleAutoScroll}>
      <source src={props.src} type="video/mp4"></source>
    </video>
  );
}

export default VideoPost;

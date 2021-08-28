import React, { useState, useContext, useEffect } from "react";
import { Avatar, Typography, Divider } from "@material-ui/core";
import Header from "./Header";
import VideoPost from "./VideoPost";
import { AuthContext } from "../context/AuthProvider";
import { firebaseDB } from "../config/firebase";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [postsCount, setPostsCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(async () => {
    let doc = await firebaseDB.collection("user").doc(currentUser.uid).get();
    let pdoc = await firebaseDB.collection("posts").get();
    let userArray = [];
    for (let i = 0; i < pdoc.docs.length; i++) {
      if (pdoc.docs[i].data().uid == currentUser.uid) {
        userArray.push(pdoc.docs[i].data());
      }
    }
    setUserData(doc.data());
    setProfile(doc.data().profileImageUrl);
    setName(doc.data().username);
    setUserPosts(userArray);
    setPostsCount(doc.data().postsCreated.length);
  }, []);

  return (
    <div>
      <Header></Header>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:"space-evenly",
            margin: "20px",
            width:"600px",
          }}
        >
          <Avatar
            src={profile}
            style={{ width: "150px", height: "150px" }}
          ></Avatar>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: "100px",
              width: "300px",
            }}
          >
            <Typography variant="p">{name}</Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <Typography variant="p">{postsCount} posts</Typography>
              <Typography variant="p">2 followers</Typography>
              <Typography variant="p">2 following</Typography>
            </div>
          </div>
        </div>
      </div>
      <Divider></Divider>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "30px",
          flexDirection:"column",
        }}
      >
        {userPosts.map((postObj) => {
          return <VideoPost key={postObj.pid} postObj={postObj}></VideoPost>;
        })}
      </div>
    </div>
  );
};

export default Profile;

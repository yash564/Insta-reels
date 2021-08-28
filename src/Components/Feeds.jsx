import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { AuthContext } from "../context/AuthProvider";
import { Button, IconButton, Typography } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { firebaseDB, firebaseStorage, timeStamp } from "../config/firebase";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { uuid } from "uuidv4";
import VideoPost from "./VideoPost";

const Feeds = (props) => {
  const [videoFile, setVideoFile] = useState(null);
  const { currentUser, signOut } = useContext(AuthContext);
  const [videoError, setVideoError] = useState("");
  const [posts, setPosts] = useState([]);

  const handleInputFile = (e) => {
    let fileObject = e.target.files[0];
    setVideoFile(fileObject);
  };

  const handleUploadFile = async () => {
    try {
      if (videoFile.size / 1000000 > 5) {
        setVideoError("Selected File Exceeds 5MB Cannot Upload!!");
        return;
      }
      let uid = currentUser.uid;
      const uploadVideoObject = firebaseStorage
        .ref(`/profilePhotos/${uid}/${Date.now()}.mp4`)
        .put(videoFile);
      uploadVideoObject.on("state_changed", fun1, fun2, fun3);

      function fun1(snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      }

      function fun2(error) {
        console.log(error);
      }

      async function fun3() {
        let videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
        let pid = uuid();
        await firebaseDB.collection("posts").doc(pid).set({
          pid: pid,
          uid: uid,
          Comments: [],
          Likes: [],
          videoLink: videoUrl,
          createdAt: timeStamp(),
        });
        let doc = await firebaseDB.collection("user").doc(uid).get();
        let document = doc.data();
        document.postsCreated.push(pid);
        await firebaseDB.collection("user").doc(uid).set(document);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const conditionObject = {
      root: null,
      threshold: "0.8",
    };

    function cb(entries) {
      entries.map((entry) => {
        let child = entry.target.children[0];

        child.play().then(function () {
          if (entry.isIntersecting == false) {
            child.pause();
          }
        });
      });
    }

    let observingObject = new IntersectionObserver(cb, conditionObject);
    let elements = document.querySelectorAll(".video-container");
    elements.forEach((el) => {
      observingObject.observe(el);
    });
  }, [posts]);

  useEffect(async () => {
    // let document = await firebaseDB.collection("posts").get();
    // let allPosts = document.docs.map((doc) => {
    //   return doc.data();
    // });
    // setPosts(allPosts);
    firebaseDB.collection("posts").onSnapshot((snapshot) => {
      let allPosts = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setPosts(allPosts);
    });
  }, []);

  return (
    <div>
      <Header></Header>
      <div className="upload-video">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "15px",
            marginLeft:"35vw",
            border:"2px solid lightgrey",
            height:"7vh",
            width:"27vw",
          }}
        >
          <Typography style={{ display: "inline", marginRight:"2vw" }} variant="h5">
            Add a new Reel
          </Typography>
          <label for="file" style={{ marginRight:"1.5vw" }}>
            <AddPhotoAlternateIcon
              style={{ fontSize: "30px" }}
            ></AddPhotoAlternateIcon>
            <input
              type="file"
              id="file"
              onChange={(e) => {
                handleInputFile(e);
              }}
              hidden
            />
          </label>
          <label>
            <Button
              onClick={handleUploadFile}
              variant="contained"
              color="secondary"
              startIcon={<PhotoCamera></PhotoCamera>}
            >
              Upload
            </Button>
          </label>
          <p>{videoError}</p>
        </div>
      </div>
      <div
        className="feeds-video-list"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {posts.map((postObj) => {
          return <VideoPost key={postObj.pid} postObj={postObj}></VideoPost>;
        })}
      </div>
    </div>
  );
};

export default Feeds;

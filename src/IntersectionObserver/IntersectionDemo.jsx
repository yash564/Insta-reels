import React, { useEffect } from "react";
import video1 from "./v1.mp4";
import video2 from "./v2.mp4";
import video3 from "./v3.mp4";
import video4 from "./v4.mp4";
import "./Inter.css";

const IntersectionDemo = () => {

  useEffect(()=>{
    const conditionObject={
      root:null,
      threshold:"0.8"
    }

    function cb(entries){
      entries.forEach((entry)=>{
        let child=entry.target.children[0];

        child.play().then(function(){
          if(entry.isIntersecting==false){
            child.pause();
          }
        })
      })
    }

    let observingObject=new IntersectionObserver(cb,conditionObject);
    let elements=document.querySelectorAll(".video-container");
    elements.forEach((el)=>{
      observingObject.observe(el);
    })
  },[])

  return (
    <div>
      <div className="video-container">
        <Video src={video1} id="a"></Video>
      </div>
      <div className="video-container">
        <Video src={video2} id="b"></Video>
      </div>
      <div className="video-container">
        <Video src={video3} id="c"></Video>
      </div>
      <div className="video-container">
        <Video src={video4} id="d"></Video>
      </div>
    </div>
  );
};

function Video(props) {
  return (
    <video className="video-styles" controls muted={true} id={props.id}>
      <source src={props.src} type="video/mp4"></source>
    </video>
  );
}

export default IntersectionDemo;

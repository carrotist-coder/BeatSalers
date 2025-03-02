import React from "react";
import AudioItem from "./AudioItem";
import "./UserStyles.css";


const AudioList = () => {
    return (
        <div className="user-list">
            <AudioItem/>
            <AudioItem/>
            <AudioItem/>
            <AudioItem/>
            <AudioItem/>
            <AudioItem/>
            <AudioItem/>
        </div>
    );
}

export default AudioList;

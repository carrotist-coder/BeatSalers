import React from "react";
import AudioItem from "./AudioItem";
import "./UserStyles.css";


const AudioList = () => {
    return (
        <div className="user-list">
            <h3 className="list__title">Аранжировки:</h3>
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

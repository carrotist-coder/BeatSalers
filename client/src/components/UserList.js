import React from "react";
import UserItem from "./UserItem";
import "./UserStyles.css";

const UserList = () => {
    return (
        <div className="user-list">
            <h3 className="list__title">Музыканты:</h3>
            <UserItem/>
            <UserItem/>
            <UserItem/>
            <UserItem/>
            <UserItem/>
        </div>
    );
}

export default UserList;

import React from "react";
import UserItem from "./UserItem";
import "./UserStyles.css";

const UserList = () => {
    return (
        <div className="user-list">
            <UserItem/>
            <UserItem/>
            <UserItem/>
            <UserItem/>
            <UserItem/>
        </div>
    );
}

export default UserList;

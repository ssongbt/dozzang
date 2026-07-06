import axios from "axios";
import {useEffect, useState} from "react";
import AdminMenu from "../admin/AdminMenu";

const UserList = () =>{

    return(
        <div id="userlist">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'userlist'}
                    />
                </div>
                <div className="userlist-gap">
                    <div className="userlist-wrap">
                        
                    </div>
                    {/* <Pagination page={page} perPage={limit} total={total} onPageChange={onChangePage}/> */}
                </div>
            </div>
        </div>
    )
}

export default UserList;
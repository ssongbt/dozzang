import axios from "axios";
import {useEffect, useState} from "react";
import AdminMenu from "../admin/AdminMenu";

const AdminList = () =>{

    const [adminList, setAdminList] = useState([
        {
            admin:[]
        }
    ]);
    const [myLevel, setMyLevel] = useState();

    useEffect(()=>{
        getAdmin()
    },[])

    const getAdmin = () =>{
        axios({
            url:'/api/admin/adminlist',
            method:'GET',
        })
        .then((res)=>{
            setAdminList({admin:res.data.adminlist})
            setMyLevel(res.data.myLevel);
            // console.log(res.data.myLevel);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const changeLevel = (num, level, id) => {
        let levelCheck = false;
        let idCheck = id;
        if(level===0){
            if(!window.confirm(idCheck + "님을 관리자로 승인하시겠습니까?")){
                return false;
            }else{
                levelCheck = true;
            }
        }
        if(level === 1){
            if(!window.confirm(idCheck + "님을 최고관리자로 승인하시겠습니까?")){
                return false;
            }else{
                levelCheck = true;
            }
        }
        if(level === 2){
            alert("이미 최고관리자입니다.");
            return false;
        }
        if(levelCheck === true){
            axios({
                url:'/api/admin/adminlist/level',
                method:'POST',
                data:{num : num, level: level}
            })
            .then((res)=>{
                alert(res.data.msg);
                window.location.reload('/admin/adiminlist');
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

    const delAdmin = (num, id) =>{
        let idCheck = id;
        if(!window.confirm(idCheck + "님을 정말 삭제하시겠습니까?")){
            return false;
        }else{
            axios({
                url:'/api/admin/adminlist/del',
                method:'POST',
                data : {num, num}
            })
            .then((res)=>{
                alert(res.data.msg);
                window.location.reload('/admin/adiminlist');
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

    const adminlist = adminList.admin && adminList.admin.map(list=>{
        return(
            <div className="admin-wrap" key={list.admin_num}>
                <div className="admin-gap">
                    <div className="admin">
                        <div className="adminId"> {list.admin_id}</div>
                        <div className="adminMail"> {list.admin_email}</div>
                        <div className="adminLevel">{list.admin_level} </div>
                        {myLevel === 2 ? 
                        <div className="superAdmin">
                            <div className="btn-gap">
                                <button className="changeLevel" onClick={()=>changeLevel(list.admin_num, list.admin_level, list.admin_id)}>승인</button>
                                <button className="delAdmin" onClick={()=>delAdmin(list.admin_num, list.admin_id)}>삭제</button>
                            </div>
                        </div>
                        :''}
                    </div>
                </div>
            </div>
        )
    })

    return(
        <div id="adminlist">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'adminlist'}
                    />
                </div>
                <div className="adminlist-gap">
                    <div className="adminlist-wrap">
                        {adminlist}
                    </div>
                    {/* <Pagination page={page} perPage={limit} total={total} onPageChange={onChangePage}/> */}
                </div>
            </div>
        </div>
    )
}

export default AdminList;
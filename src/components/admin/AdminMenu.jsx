import { Link  } from 'react-router-dom';

const AdminMenu = ({menu}) => {
    // console.log(menu);
    console.log();
    return(
        <div className="admin-menu">
            <div className="wrap">
                <div className="admin-gap">
                    <div className={menu ==='playlist' ? "playlist on" : "playlist"}>
                        <a href="/admin/playlist">
                        공연리스트
                        </a>
                    </div>
                    <div className={menu ==='userlist' ? "userlist on" : "userlist"}>
                        <a href="/admin/userlist">
                        회원리스트
                        </a>
                    </div>
                    <div className={menu ==='adminlist' ? "adminlist on" : "adminlist"}>
                        <a href="/admin/adminlist">
                        관리자리스트
                        </a>
                    </div>
                    <div className={menu ==='noticelist' ? "noticelist on" : "noticelist"}>
                        공지사항
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminMenu;
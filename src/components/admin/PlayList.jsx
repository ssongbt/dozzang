import axios from "axios";
import {useEffect, useState} from "react";
import { Link, useSearchParams  } from 'react-router-dom';
import Pagination from "../common/Pagination";
import { parseISO, format } from "date-fns";
// import Parser from 'html-react-parser';
import Stampimg from "../../assets/stamp.png";
import AdminMenu from "../admin/AdminMenu";

const PlayList = () => {

    const [playList, setPlayList] = useState([
        {
            play:[]
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    


    const [limit, setLimit] = useState(0);
    const [total, setTotal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search');
    const cate = searchParams.get('cate') ;
    const page = searchParams.get('page') ? searchParams.get('page') : 1;

    useEffect(()=>{
        axiosGet();
    }, [currentPage], [search]);


    const onChangePage = (page) => {
        // console.log("누를때파람스",params.page);
        setCurrentPage(page);
        // axiosGet();
        if(searchParams.get('search') && searchParams.get('search') !== 'null'){
            window.location.href = `/admin/playlist?page=${page}&cate=${searchParams.get('cate') === 'null' ? 'title' : searchParams.get('cate')}&search=${searchParams.get('search')}`;
        }else{
            window.location.href = `/admin/playlist?page=${page}`;
        }
        // console.log("page",page);
        // console.log("currentpage",currentPage);
    }

    const axiosGet=()=>{
 
        // console.log("get실행");
        // console.log(page)
        // console.log(currentPage);
        // console.log(searchParams.get('search'));
        // console.log(searchParams.get('cate'));
        if(searchParams.get('search') && searchParams.get('search') !== 'null'){
            console.log("키워드있을 때");
            axios({
                url:`/api/admin/playlist?page=${page}&cate=${cate}&search=${search}`,
                method:'GET',
            })
            .then((res)=>{
                setPlayList({play:res.data.rows.rows})
                setTotal(res.data.total);
                setLimit(res.data.limit);
                // setTotal(res.data.rows.rowCount);
                // console.log("rows",res.data.rows);
            })
            .catch((err)=>{
                console.log(err);
            });

        }else{

            axios({
                url:`/api/admin/playlist`,
                method:'GET',
            })
            .then((res)=>{
                setPlayList({play:res.data.rows.rows})
                setTotal(res.data.total);
                setLimit(res.data.limit);
                // setTotal(res.data.rows.rowCount);
                // console.log("rows",res.data.rows);
            })
            .catch((err)=>{
                console.log(err);
            });
        }
        

    }

    const findSearch = () => {
        console.log("검색할때");

        searchParams.set('cate', searchParams.get('cate') === 'null' ? 'title' : searchParams.get('cate'));
	    setSearchParams(searchParams);
        if(searchParams.get('search') && searchParams.get('search') !== 'null'){
            window.location.href = `/admin/playlist?page=${page}&cate=${searchParams.get('cate') === 'null' ? 'title' : searchParams.get('cate')}&search=${searchParams.get('search')}`;
        }else{

        }

    }

    const viewDetail = (num) =>{
        window.location.href = `/admin/playlist/play/${num}`;
    }

    const addDouble = (num)=>{
        window.location.href = `/admin/play/double/${num}`;
    }


    const list = playList.play && playList.play.map(list=>{
        // const imgUrl = "/upload/"+ list.play_img;
        const startDate = list.play_start ? format(parseISO(list.play_start),'yyyy-MM-dd') : "미정";
        const endDate = list.play_end ? format(parseISO(list.play_end),'yyyy-MM-dd') : "미정";
        return(
            
            <div className="play-wrap" key={list.play_num} >
                <div className="play-gap" >
                    {/* <div className="playImg"><img src={imgUrl}/></div> */}
                    <div className="play" onClick={()=>viewDetail(list.play_num)} >
                        <div className="playName">  {list.play_genre} &lt;{list.play_name}&gt; 
                            {list.play_stamp===1 ? <img className="stampImg" src={Stampimg} alt="stamp"/>: ''}
                            <span className="firststamp">{list.play_firststamp}</span>
                        </div>
                        <div className="playDate">{startDate} ~ {endDate} </div>
                        
                    </div>
                    <div className="double-btn">
                        <div className="btn-gap">
                            <button className="d-btn" onClick={()=>addDouble(list.play_num)}>더블 적립 추가</button>
                        </div>
                    </div>
                </div>
            </div>
            
        )    
    })




     return (
        <div id="playlist">
            <div className="wrap">
                <div className="menu">
                    <AdminMenu 
                        menu={'playlist'}
                    />
                </div>
                {/* <div className="menu-title">
                    공연리스트
                </div> */}
                <div className="playlist-gap">
                    <div className="=playlist-wrap">
                        {list}
                    </div>
                    <Pagination page={page} perPage={limit} total={total} onPageChange={onChangePage}/>
                    <div className="search-wrap">
                        <select className="search-select" defaultValue={searchParams.get('cate')} onChange={(e)=>searchParams.set('cate', e.target.value)}>
                            <option value="title" >공연명</option>
                            <option value="cast" >출연진</option>
                        </select>
                        <input type="text" defaultValue={searchParams.get('search')} onChange={(e)=>searchParams.set('search', e.target.value)}></input>
                        <button onClick={()=>findSearch()}>검색</button>
                    </div>
                    <div className="btn">
                        <button><Link to="/admin/playlist/add">공연 추가</Link></button>
                    </div>
                </div>
            </div>
        </div>


     )

  }
  
  export default PlayList;
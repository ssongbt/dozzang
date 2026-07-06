import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const Pagination = ({page, perPage, total, onPageChange}) => {

    const pageNum = Math.ceil(total/perPage);
    const [currentPage, setCurrentPage] = useState(page);

    const firstPage = currentPage%5 ===0 ? currentPage - (currentPage%5)+1 -5 : currentPage - (currentPage%5)+1;
    // const lastPage = (currentPage - (currentPage%5)+5)<pageNum&&currentPage===0 ? pageNum : currentPage - (currentPage%5)+5;
    const lastPage = currentPage%5===0 ? currentPage : (currentPage - (currentPage%5)+5<pageNum ? currentPage - (currentPage%5)+5 : pageNum) ;
    const pagelist = [];
    for(let i=firstPage; i <= lastPage;i++) {
        pagelist.push(i);
    }
    // console.log({"currPage is":currentPage, "firsNum is" : firstPage, "page is" : page, "lastpage" : lastPage})
    const length = pageNum;
    // console.log(currentPage - (currentPage%5));


    return (
        <nav>
            <div className="pagination">
                <div className="wrap">
                    <div className="page">
                        
                        {
                            length > 5  && <li className="prepage" onClick={()=>{onPageChange(Number(page)-1); setCurrentPage(Number(page)-2);}} disabled={page===1}> {'<'} </li>
                        }
                        {pagelist.map(pagelist=>{
                            // console.log(typeof page);
                            // if(pagelist === page ){
                            //     return(
                            //         <li key={pagelist} className="current" onClick={()=>onPageChange(pagelist)}>{pagelist}</li>
                            //     )
                            // }
                            return(
                                
                                <li key={pagelist} className={pagelist === Number(page) ? "current":""} onClick={()=>onPageChange(pagelist)}>{pagelist}</li>
                            )
                        })}
                        {
                            length > 5  && <li className="nextpage" onClick={()=>{onPageChange(Number(page)+1); setCurrentPage(page);}} disabled={page===pageNum}> {'>'} </li>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )

}

export default Pagination;
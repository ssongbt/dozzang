import axios from "axios";
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {useEffect, useState, forwardRef} from "react";
import Linkimg from "../../assets/free-icon-link-2089782.png";

const BenefitCheck = ({benefitNum, double}) =>{

    console.log(benefitNum);
    const [detailParams] = useSearchParams();
    const [benefit, setBenefit] = useState([]);

    const getBenefit = () => {
        const playNum = detailParams.get('playNum');

        axios({
            url:'/api/myhome/stamp/benefitcheck',
            method:'POST',
            data:{
                playnum : playNum,
                benefitnum : benefitNum,
                double : double
            }
        })
        .then((res)=>{
            console.log(res);
            setBenefit(res.data.rows);
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    useEffect(()=>{
        getBenefit();
    },[])

    return(
        <div className="benefitList">
             {benefit && benefit.map(list=>{
                return(
                    <div className="benefit" key={list.stamp_num}>
                        <div className="getBenefit">
                            <span className="benefitName" >{list.stamp_benefit}</span>
                                {list.stamp_url ? 
                                    <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${list.stamp_url}`, "_blank")} />
                                    :''}
                            <span className="useDate">
                                {list.stamp_usestartdate || list.stamp_useenddate ? ' (사용기간 ' : ''}
                                {list.stamp_usestartdate ? format(parseISO(list.stamp_usestartdate),'yyyy-MM-dd') :''}
                                {list.stamp_usestartdate || list.stamp_useenddate ? ' ~ ' : ''}
                                {list.stamp_useenddate ? format(parseISO(list.stamp_useenddate),'yyyy-MM-dd') :''}
                                {list.stamp_usestartdate || list.stamp_useenddate ? ')' : ''}
                            </span>
                        </div>

                        <div className="memo">
                            {list.stamp_memo ? '('+list.stamp_memo.trim()+')' :''}
                        </div>

                    </div>

                )
             })}

        </div>
    )

}

export default BenefitCheck;
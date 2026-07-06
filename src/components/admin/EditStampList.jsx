import axios from "axios";
import { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { PencilSquare, TrashFill } from "react-bootstrap-icons";

const EditStampList = ({playNum, stampNum, stampBenefitNum, stampBenefit, stampGetStartDate, stampGetEndDate, stampUseStartDate, stampUseEndDate, stampUrl, stampMemo}) => {

    // const getEndDate = playStart !== null ? (playStart+"").substr(0,10) : '';
    // const useEndDate = playEnd !== null ? (playEnd+"").substr(0,10) : '';
    // const {stamps} = this.state;
    
    // const [stamp, setStamp] = useState({
    //     playNum:'',
    //     benefitNum:'',
    //     benefit:'',
    //     getEndDate:'',
    //     useEndDate:'',
    //     memo:''
    // });
    // setStamp(inputItmes);
    // console.log("item",item);
    
    const [benefitNum, setBenefitNum] = useState();
    const [benefit, setBenefit] = useState();
    const [getStartDate, setGetStartDate] = useState();
    const [getEndDate, setGetEndDate] = useState();
    const [useStartDate, setUseStartDate] = useState();
    const [useEndDate, setUseEndDate] = useState();
    const [url, setUrl] = useState();
    const [memo, setMemo] = useState();
    // const date = useEndDate !== undefined ? format(parseISO(useEndDate),"yyyy-MM-dd") : '';
    // console.log("date",);
    // const useDate = "";
    // console.log("typeof", typeof useEndDate);
    // const date = new Date();
    // const date = '0000-00-00';
    // const useDate = format(date, "yyyy-MM-dd");
    // console.log("useDate",useDate);
    useEffect(()=>{
        
        setBenefitNum(stampBenefitNum);
        setBenefit(stampBenefit);
        setGetStartDate(stampGetStartDate);
        setGetEndDate(stampGetEndDate);
        setUseStartDate(stampUseStartDate);
        setUseEndDate(stampUseEndDate);
        setUrl(stampUrl);
        setMemo(stampMemo);
        // console.log(benefit);
    },[stampNum])


    const editStamp = async(e) => {
 
        if(!benefitNum){
            alert("혜택 회차를 입력해주세요.");
            return false;
        }

        if(!benefit){
            alert("재관 혜택을 입력해주세요.");
            return false;
        }

        const stamp = {
            stampNum : e,
            benefitNum : benefitNum,
            benefit : benefit,
            getStartDate : getStartDate,
            getEndDate : getEndDate,
            useStartDate : useStartDate,
            useEndDate : useEndDate,
            url : url,
            memo : memo
        }

        await axios({
            url:`/api/admin/playlist/stamp/edit/`,
            method:'POST',
            data: stamp
        })
        .then((res)=>{
            alert(res.data.msg);
            if(res.data.code === 'S'){
                window.location.reload();
            }else{
                return false;
            }
        })
        .catch((err)=>{
            alert("err",err);
            console.log(err);
        });
    }

    const deleteStamp = (e) => {
        if(window.confirm('정말 삭제하시겠습니까?')){
            const stampnum = e;

            axios({
                url:`/api/admin/playlist/stamp/del/${stampnum}`,
                method:'POST'
            })
            .then((res)=>{
                alert(res.data.msg);
                if(res.data.code === 'S'){
                    window.location.reload();
                }else{
                    return false;
                }
            })
            .catch((err)=>{
                console.log(err);
            })

        }else{
            return false;
        }

    }

    return(
        // <></>
        <div className="addStamp">
            {/* {inputItems && inputItems.map((item, index) => { */}
                

                {/* return( */}
                    <li key={stampNum}>
                        <div className="stampbox-wrap">
                        {/* {setBenefit(item.stamp_benefit)} */}
                        <div className="inputstampbox benefitnum">
                            <label htmlFor="benefitNum">회차</label>
                            <br></br>
                            <input type="text" name="benefitNum" id="benefitNum" defaultValue={benefitNum} onChange={(e)=>setBenefitNum(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox benefit">
                            <label htmlFor="benefit">재관혜택</label>
                            <br></br>
                            <input type="text" name="benefit" id="benefit" defaultValue={benefit} onChange={(e)=>setBenefit(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox memo">
                            <label htmlFor="memo">주의사항</label>
                            <br></br>
                            <input type="text" name="memo" id="memo" defaultValue={memo} onChange={(e)=>setMemo(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox url">
                            <label htmlFor="url">링크</label>
                            <br></br>
                            <input type="text" name="url" id="url" defaultValue={url} onChange={(e) =>setUrl(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox getstartdate">
                            <label htmlFor="getStartDate">수령 시작일</label>
                            <br></br>
                            <input type="date" name="getStartDate" id="getStartDate" defaultValue={getStartDate ? getStartDate: ''} onChange={(e)=>setGetStartDate(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox getenddate">
                            <label htmlFor="getEndDate">수령 종료일</label>
                            <br></br>
                            <input type="date" name="getEndDate" id="getEndDate" defaultValue={getEndDate ? getEndDate: ''} onChange={(e)=>setGetEndDate(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox usestartdate">
                            <label htmlFor="useStartDate">사용 시작일</label>
                            <br></br>
                            <input type="date" name="useStartDate" id="useStartDate" defaultValue={useStartDate ? useStartDate: ''} onChange={(e)=>setUseStartDate(e.target.value)}></input>
                        </div>
                        <div className="inputstampbox useenddate">
                            <label htmlFor="useEndDate">사용 종료일</label>
                            <br></br>
                            <input type="date" name="useEndDate" id="useEndDate" defaultValue={useEndDate ? useEndDate : ''} onChange={(e)=>setUseEndDate(e.target.value)}></input>
                        </div>
                    </div>

                    <div className="stamp-btn">
                            <PencilSquare className="e-btn edit" onClick={(e)=> editStamp(stampNum)}></PencilSquare>
                            
                            <TrashFill className="e-btn del" onClick={(e) => deleteStamp(stampNum)}>삭제</TrashFill>
                    </div>
                </li>
                {/* ); */}
            {/* })} */}

        </div>
    );
}

export default EditStampList;

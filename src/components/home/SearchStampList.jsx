
import {useEffect, useState} from "react";
import SearchPlayStamp from "./SearchPlayStamp";

const SearchStampList = ({playNum, stamp}) => {

    console.log("stamp", stamp)

    const result = (arr, prop) =>{
        return [...new Map(arr&&arr.map((m) => [m[prop], m])).values()];
    }
    // console.log(result(stamp.stamp, 'stamp_benefit_num'));
    // console.log(stamp.stamp);

    const [stampList, setStampList] = useState({
        stamp :[]
    });

    const newList = () => {
        const newStampList  = stamp.stamp && stamp.stamp.filter((benefit) => benefit.stamp_play_num === playNum)
        setStampList({stamp:newStampList});
        // console.log("stamplist", stampList);
    }

    useEffect(()=>{
        newList();
        // console.log("newlist",stampList);
    }, [playNum]);

    return(
        <div className="stamplist">
            {stampList.stamp && result(stampList.stamp, 'stamp_benefit_num').map(benefit=>{
                return(
                    <div className="benefitlist" key={benefit.stamp_num}>
                        <div className="benefitNum">
                            <span>{benefit.stamp_benefit_num}회차</span>
                        </div>
                            <SearchPlayStamp 
                                key={benefit.stamp_num}
                                className="stamp-benefit"
                                stampbenefit={benefit.stamp_benefit_num}
                                stamplist={stampList.stamp}
                                type="list" />
                    </div>
                )
            })}
        </div>
    )


    // return(
    //     <div>
    //         {stamp.stamp.filter((list) => list.stamp_play_num === playNum).map((list) =>(
    //             // console.log("benefit", list);
    //             <div key={list.stamp_num}>
    //                 {/* {list.stamp_num} */}
    //                 {list.stamp_benefit_num}
    //                 {newList.map}
    //             </div>
    //         ))}
    //     </div>
    // )

    // return(
    //     <div className="stamplist">
    //         {stamp.stamp && stamp.stamp.map(list => {
    //             // console.log("list",list);
    //             if(playNum === list.stamp_play_num){
    //                 result(stamp.stamp, 'stamp_benefit_num')&&result(stamp.stamp, 'stamp_benefit_num').map(benefit=>{
    //                     // console.log("benfit",benefit);
    //                     return(
    //                         <div>
    //                             {benefit.stamp_benefit_num}
    //                         <SearchPlayStamp 
    //                         stampbenefit={benefit.stamp_benefit_num}
    //                         stamplist={stamp.stamp}
    //                         />
    //                         </div>
    //                     )
    //                 })
    //                 // return(
    //                 //     <div className="benefit" key={list.stamp_num}>
    //                 //         <span>{list.stamp_benefit_num}회차</span> {list.stamp_benefit}

    //                 //     </div>
    //                 // )
    //             }
    //         })}
    //     </div>
    // )
}


export default SearchStampList
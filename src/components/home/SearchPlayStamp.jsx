import { Link45deg } from "react-bootstrap-icons";
import { format, parseISO } from 'date-fns';
import Linkimg from "../../assets/free-icon-link-2089782.png";

const SearchPlayStamp = ({stampbenefit, stamplist, type}) =>{
    console.log(stampbenefit);
    console.log(stamplist);
    console.log(type);
    return(
        <div className="searchPlayStamp">
            {stamplist && stamplist.map((stamp =>{
                
                if(stampbenefit===stamp.stamp_benefit_num){
                    if(type === 'list'){
                        return(
                            <div className="benefit" key={stamp.stamp_num}>
                                {stamp.stamp_benefit}
                            </div>
                        )
                    }else{
                        return(
                            <div key={stamp.stamp_num}>

                                <div className="benefit">
                                    <span className="benefitName" >{stamp.stamp_benefit}</span>
                                    {stamp.stamp_url ? 
                                        <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${stamp.stamp_url}`, "_blank")} />
                                        :''}
                                </div>
                                <div className="getDate">
                                    {stamp.stamp_getstartdate || stamp.stamp_getenddate ? '수령기간 ' : ''}
                                    {stamp.stamp_getstartdate ? format(parseISO(stamp.stamp_getstartdate),'yyyy-MM-dd') :''}
                                    {stamp.stamp_getstartdate || stamp.stamp_getenddate ? ' ~ ' : ''}
                                    {stamp.stamp_getenddate ? format(parseISO(stamp.stamp_getenddate),'yyyy-MM-dd') :''}
                                </div>
                                <div className="useDate">
                                    {stamp.stamp_usestartdate || stamp.stamp_useenddate ? '사용기간 ' : ''}
                                    {stamp.stamp_usestartdate ? format(parseISO(stamp.stamp_usestartdate),'yyyy-MM-dd') :''}
                                    {stamp.stamp_usestartdate || stamp.stamp_useenddate ? ' ~ ' : ''}
                                    {stamp.stamp_useenddate ? format(parseISO(stamp.stamp_useenddate),'yyyy-MM-dd') :''}
                                </div>
                                <div className="memo">
                                    {stamp.stamp_memo ? '('+stamp.stamp_memo.trim()+')' :''}
                                </div>

                            </div>
                        )
                    }
                }
            }))}
        </div>
    )

}

export default SearchPlayStamp;
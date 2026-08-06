import { Link45deg } from "react-bootstrap-icons";
import Linkimg from "../../assets/free-icon-link-2089782.png";
import { formatStampDate } from "../../utils/formatStampDate";
import { getBenefitDisplayText } from "../../utils/benefitDisplay";

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
                                {getBenefitDisplayText(stamp)}
                            </div>
                        )
                    }else{
                        return(
                            <div key={stamp.stamp_num}>

                                <div className="benefit">
                                    <span className="benefitName" >{stamp.stamp_benefit_emoji} {getBenefitDisplayText(stamp)}</span>
                                    {stamp.stamp_url ? 
                                        <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${stamp.stamp_url}`, "_blank")} />
                                        :''}
                                </div>
                                <div className="getDate">
                                    {stamp.stamp_getstartdate || stamp.stamp_getenddate ? '수령기간 ' : ''}
                                    {formatStampDate(stamp.stamp_getstartdate)}
                                    {stamp.stamp_getstartdate || stamp.stamp_getenddate ? ' ~ ' : ''}
                                    {formatStampDate(stamp.stamp_getenddate)}
                                </div>
                                <div className="useDate">
                                    {stamp.stamp_usestartdate || stamp.stamp_useenddate ? '사용기간 ' : ''}
                                    {formatStampDate(stamp.stamp_usestartdate)}
                                    {stamp.stamp_usestartdate || stamp.stamp_useenddate ? ' ~ ' : ''}
                                    {formatStampDate(stamp.stamp_useenddate)}
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
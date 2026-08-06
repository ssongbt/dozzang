import { format, parseISO } from "date-fns";
import { useState } from "react";
import playStampList from "../../data/playStampList.json";
import Linkimg from "../../assets/free-icon-link-2089782.png";
import { getBenefitStatus, setBenefitStatus } from "../../utils/stampStorage";

const getCouponCount = (text) => {
    if (!text || !text.includes("할인권")) {
        return 0;
    }
    const occurrences = (text.match(/할인권/g) || []).length;
    const qtyMatch = text.match(/(\d+)\s*(매|장|종)/);
    const qty = qtyMatch ? Number(qtyMatch[1]) : 0;
    return Math.max(occurrences, qty, 1);
};

const BenefitCheck = ({ playNum, coalesce, mySum }) => {

    const [, forceUpdate] = useState(0);

    const benefits = playStampList
        .filter((b) => b.stamp_play_num === Number(playNum))
        .sort((a, b) => a.stamp_benefit_num - b.stamp_benefit_num);

    if (benefits.length === 0) {
        return <p className="no-benefit">등록된 혜택이 없습니다</p>;
    }

    const toggleReceived = (benefitNum) => {
        const current = getBenefitStatus(playNum, coalesce, benefitNum);
        setBenefitStatus(playNum, coalesce, benefitNum, { received: !current.received });
        forceUpdate((n) => n + 1);
    };

    const toggleUsed = (benefitNum, idx, couponCount) => {
        const current = getBenefitStatus(playNum, coalesce, benefitNum);
        const usedArr = Array.isArray(current.used) && current.used.length === couponCount
            ? [...current.used]
            : Array(couponCount).fill(false);
        usedArr[idx] = !usedArr[idx];
        setBenefitStatus(playNum, coalesce, benefitNum, { used: usedArr });
        forceUpdate((n) => n + 1);
    };

    return (
        <div className="benefitCheckList">
            {benefits.map((list) => {
                const achieved = Number(mySum) >= Number(list.stamp_benefit_num);
                const status = getBenefitStatus(playNum, coalesce, list.stamp_benefit_num);
                const couponCount = getCouponCount(list.stamp_benefit);
                const usedArr = Array.isArray(status.used) ? status.used : [];

                return (
                    <div className={`benefitlist ${achieved ? 'achieved' : 'locked'}`} key={list.stamp_num}>
                        <div className="benefitNum">
                            <span>{list.stamp_benefit_emoji || '🎁'} {list.stamp_benefit_num}회차</span>
                        </div>
                        <div className="benefitBody">
                            <div className="benefit">
                                <span className="benefitName">{list.stamp_benefit}</span>
                                {list.stamp_url ?
                                    <img className="linkImg" src={Linkimg} alt="link" onClick={() => window.open(`${list.stamp_url}`, "_blank")} />
                                    : ''}
                            </div>

                            {(list.stamp_usestartdate || list.stamp_useenddate) &&
                                <div className="useDate">
                                    사용기간 {list.stamp_usestartdate ? format(parseISO(list.stamp_usestartdate), 'yyyy-MM-dd') : ''}
                                    {' ~ '}
                                    {list.stamp_useenddate ? format(parseISO(list.stamp_useenddate), 'yyyy-MM-dd') : ''}
                                </div>
                            }

                            {list.stamp_memo ?
                                <div className="memo">({list.stamp_memo.trim()})</div>
                                : ''}

                            {achieved ?
                                <div className="benefitCheckRow">
                                    <label className="benefitCheck">
                                        <input type="checkbox" checked={!!status.received} onChange={() => toggleReceived(list.stamp_benefit_num)} />
                                        수령완료
                                    </label>
                                    {couponCount > 0 &&
                                        <div className="couponRow">
                                            {Array.from({ length: couponCount }).map((_, i) => (
                                                <label className="benefitCheck" key={i}>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!usedArr[i]}
                                                        disabled={!status.received}
                                                        onChange={() => toggleUsed(list.stamp_benefit_num, i, couponCount)}
                                                    />
                                                    할인권{couponCount > 1 ? `${i + 1}` : ''} 사용
                                                </label>
                                            ))}
                                        </div>
                                    }
                                </div>
                                :
                                ''
                            }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default BenefitCheck;

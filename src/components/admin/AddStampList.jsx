const AddStampList = ({inputItmes, addInput, InputDelete, onChange, confirm}) => {
    // console.log("inputItems",inputItmes);

    return(
        <div className="addStamp">
            {inputItmes.map((item, index) => {
                return(
                    <li key={index}>
                        <div className="stampbox-wrap">
                            <div className="inputstampbox benefitnum">
                                <label htmlFor="benefitNum">회차</label>
                                <br></br>
                                <input type="text" name="benefitNum" id="benefitNum" defaultValue={item.benefitNum} onChange={(e) => onChange(e, item.id)} placeholder="숫자" ></input>
                            </div>
                            <div className="inputstampbox benefit">
                                <label htmlFor="benefit">재관혜택</label>
                                <br></br>
                                <input type="text" name="benefit" id="benefit" defaultValue={item.benefit} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox memo">
                                <label htmlFor="memo">주의사항</label>
                                <br></br>
                                <input type="text" name="memo" id="memo" defaultValue={item.memo} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox url">
                                <label htmlFor="url">링크</label>
                                <br></br>
                                <input type="text" name="url" id="url" defaultValue={item.url} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox getstartdate">
                                <label htmlFor="getStartDate">수령 시작일</label>
                                <br></br>
                                <input type="date" name="getStartDate" id="getStartDate" defaultValue={item.getStartDate} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox getenddate">
                                <label htmlFor="getEndDate">수령 종료일</label>
                                <br></br>
                                <input type="date" name="getEndDate" id="getEndDate" defaultValue={item.getEndDate} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox usestartdate">
                                <label htmlFor="useStartDate">사용 시작일</label>
                                <br></br>
                                <input type="date" name="useStartDate" id="useStartDate" defaultValue={item.useStartDate} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                            <div className="inputstampbox useenddate">
                                <label htmlFor="useEndDate">사용 종료일</label>
                                <br></br>
                                <input type="date" name="useEndDate" id="useEndDate" defaultValue={item.useEndDate} onChange={(e) => onChange(e, item.id)}></input>
                            </div>
                        </div>
                        <div className="stamp-btn">
                            {index === 0 && inputItmes.length<10 && (
                                <button className="s-btn" onClick={()=> addInput()}>+</button>
                                )}
                            {index >0 && inputItmes[index-1]? (
                                <button className="s-btn" onClick={() => InputDelete(item.id)}>-</button>
                                ) : ("")}
                        </div>
                </li>
                );
            })}

        </div>

    );
}

export default AddStampList;

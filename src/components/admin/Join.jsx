import axios from "axios";
import {useEffect, useState} from "react";

const Join = () => {

    const [joinId, setJoinId] = useState();
    const [joinPw, setJoinPw] = useState();
    const [pwCheck, setPwCheck] = useState();
    const [joinEmail, setJoinEmail] = useState();

    const [idMsg, setIdMsg] = useState();
    const [pwMsg, setPwMsg] = useState();
    const [psChMsg, setPwChMsg] = useState();
    const [emailMsg, setEmailMsg] = useState();

    const [isId, setIsId] = useState(false); //T/F
    const [isPw, setIsPw] = useState(false);
    const [isPwCh, setIsPwCh] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    

    const goJoin = () =>{

        if(isId === true && isPw === true && isPwCh === true && isEmail === true){
            axios({
                url:'/api/admin/join',
                method:'POST',
                data : {id : joinId, pw : joinPw, email : joinEmail}
            })
            .then((res)=>{
                alert(res.data.msg);
                if(res.data.code === 'F'){
                    return false;
                }else{
                    window.location.href = "/admin";
                }
            })
            .catch((err)=>{
                console.log(err);
            }) 
        }else{
            alert("입력 정보를 다시 확인해주세요.");
            return false;
        }

    }

    // useEffect(()=>{
    //     IdCheck();
    // },[joinId])

    // 아이디 체크
    const onChangeId = (e) => {
        setJoinId(e.target.value);
        const id = e.target.value;
        const idRegExp = /^[a-zA-Z0-9]{4,12}$/;
        // console.log(joinId);
        if(joinId === undefined || joinId === ' '){
            setIdMsg("아이디를 입력해주세요");
        }else{
            if(!idRegExp.test(joinId)){
                setIdMsg("아이디는 4~12자 내의 영어, 숫자만 사용가능합니다.")
            }
            else{
                axios({
                    url:'/api/admin/idcheck',
                    method:'POST',
                    data : {id : id}
                })
                .then((res)=>{
                    setIdMsg(res.data.msg);
                    if(res.data.code === 'P'){
                        setIsId(true);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })                
            }
        }
    }

    //비밀번호 체크
    const onChangePw = (e) => {
        const pw = e.target.value;
        setJoinPw(pw);

        const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

        if(joinPw === undefined || joinPw === ' '){
            setPwMsg("비밀번호를 입력해주세요");
        }else{
            if(!pwRegExp.test(joinPw)){
                setPwMsg("비밀번호는 8~20자 내외의 영어, 특수문자, 숫자 조합으로 입력해주세요.")
            }
            else{
                setPwMsg("사용가능한 비밀번호입니다.");
                setIsPw(true);
            }
        }
    }

    //비밀번호 더블체크
    const onChangePwCh = (e) =>{
        const pwch = e.target.value;
        setPwCheck(pwch);
        if(isPw === true){
            if(joinPw === pwch){
                setPwChMsg("비밀번호가 일치합니다.");
                setIsPwCh(true);
            }else{
                setPwChMsg("비밀번호가 일치하지않습니다.");
            }
        }
    }

    // 이메일 체크
    const onChangeEmail = (e) =>{
        setJoinEmail(e.target.value);

        const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

        if(joinEmail === undefined || joinEmail === ' '){
            setEmailMsg("이메일을 입력해주세요");
        }else{
            if(!emailRegEx.test(joinEmail)){
                setEmailMsg("이메일 형식을 확인해주세요.")
            }
            else{
                setEmailMsg("올바른 이메일입니다.");
                setIsEmail(true);
            }
        }

    }

    return(
        <div id="join">
            <div className="wrap">
                <div className="join-gap">
                    <div className="join-wrap">
                        <div className="join-title">
                            관리자 회원가입
                        </div>
                        <div className="join-box">
                            <form id="join-form">
                                <div className="join-id"> 
                                    <div className="id">아이디</div>
                                    <input type="text" value={joinId || ''} placeholder="4~12자 내의 영어, 숫자" onChange={onChangeId}></input>
                                    {idMsg}
                                </div>
                                <div className="join-pw"> 
                                    <div className="pw" >비밀번호</div>
                                    <input type="password" value={joinPw || ''} placeholder="8~20자 내외의 영어, 특수문자, 숫자" onChange={onChangePw}></input>
                                    {pwMsg}
                                </div>
                                <div className="join-pw-ch"> 
                                    <div className="pw-ch">비밀번호 확인</div>
                                    <input type="password" value={pwCheck || ''} placeholder="비밀번호를 한번 더 입력해주세요" onChange={onChangePwCh}></input>
                                    {psChMsg}
                                </div>
                                <div className="join-email">
                                    <div className="email">이메일</div>
                                    <input type="email" value={joinEmail || ''} placeholder="xxx@xxxx.com" onChange={onChangeEmail}></input>
                                    {emailMsg}
                                </div>
                                <div className="btn">
                                    <button className="login-btn" type="button" onClick={goJoin} disabled={!(isId && isEmail && isPw && isPwCh)}>회원가입</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Join;
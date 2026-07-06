import axios from "axios";
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { parseISO, format } from "date-fns";
import {Search} from "react-bootstrap-icons";
import Searchimg from "../../assets/search.png"

const SearchingHome = () => {

    const [searchItem, setSearchItem] = useState();
    const [haveInputValue, setHaveInputValue] = useState(false);
    const [playList, setPlayList] = useState([
        {
            play:[]
        }
    ]);
    const [choiceIndex, setChoiceIndex] = useState(-1);


    const clickDropDownItem = clickedItem => {
        setSearchItem(clickedItem)
        setHaveInputValue(false)
    }

    const search = () => {
        // console.log(searchItem);
        if(searchItem===''){
            setHaveInputValue(false);
            setPlayList([])
        }else{
            axios({
                url:`/api/home/search`,
                method:'POST',
                data : {search : searchItem}
            })
            .then((res)=>{
                setPlayList({play:res.data.rows.rows});
                // console.log(res.data.rows);
            })
            .catch((err)=>{
                console.log(err);
            });

        }
    }

    const changeInput = (e) => {
        setSearchItem(e.target.value);
        setHaveInputValue(true);
        // console.log(searchItem);
    }

    const handleDropDownKey = event => {
        if(haveInputValue) {
            if(event.key === 'ArrowDown' &&
            playList.play.length - 1 > choiceIndex){
                setChoiceIndex(choiceIndex +1)
            }
            if(event.key === 'ArrowUp' && choiceIndex >=0 )
                setChoiceIndex(choiceIndex - 1)
             if(event.key === 'Enter' && choiceIndex >=0){
                clickDropDownItem(playList.play[choiceIndex].play_name)
                setChoiceIndex(-1)
            }
        }

    }

    const searchList = () =>{
        const keyword = searchItem;
        // console.log(encodeURIComponent(keyword));
        
        window.location.href = `/home/search/${encodeURIComponent(keyword)}`
        
    }

    const searchPlay = (e) =>{
        const playnum =  e;
        window.location.href = `/home/search/play/${playnum}`;
    }

    const handleOnkeyPress = (e) =>{
        if(e.key === 'Enter'){
            searchList();
        }
    }

    useEffect(search, [searchItem]);

    return(
        <div className="search-bar">
            <SearchBox>
                <InputBox haveInputValue={haveInputValue}>
                    <Input type="text" name="search" value={searchItem||""} onChange={changeInput} onKeyUp={handleDropDownKey} onKeyPress={handleOnkeyPress} placeholder="공연명을 검색하세요"/>
                    {/* <button>검색</button> */}
                    <DeleteButton onClick={() => searchList()}><img src={Searchimg} alt="search" className="search-btn"/></DeleteButton>
                </InputBox>
                {haveInputValue && (
                    <DropDownBox>
                        {playList.play && playList.play.length === 0 && (
                            <DropDownItem>해당하는 공연이 없습니다.</DropDownItem>
                            )}
                        {playList.play && playList.play.map((play, index) =>  {
                            const startDate = play.play_start ? format(parseISO(play.play_start),'yyyy') : '미정';
                            const endDate = play.play_end ? format(parseISO(play.play_end), 'yyyy') : '미정';
                            const year = startDate === endDate ? startDate : startDate - endDate;
                            return( 
                                <DropDownItem
                                    key={index}
                                    // onClick={() => clickDropDownItem(play.play_name)}
                                    onClick={() => searchPlay(play.play_num)}
                                    onMouseOver={() => setChoiceIndex(index)}
                                    className={
                                        choiceIndex === index ? 'selected' : ''
                                    }
                                >
                                    {play.play_name} ({isNaN(year) ? '미정' : year})
                                </DropDownItem>
                        )
                    } )}
                    </DropDownBox>
                )}
            </SearchBox>
        </div>

    )
}
    
const activeBorderRadius = '16px 16px 0px 0px'
const inactiveBorderRadius = '16px 16px 16px 16px'

const SearchBox = styled.div`
  width: 100%;
`

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  border: 3px solid #2a2f4f;
  border-radius: ${props =>
    props.haveInputValue ? activeBorderRadius : inactiveBorderRadius};
  z-index: 3;

  &:focus-within {
    border:3px solid #2a2f4f;
  }
`

const Input = styled.input`
  flex: 1 0 0;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 16px;
`

const DeleteButton = styled.div`
  cursor: pointer;
`
const DropDownBox = styled.ul`
  display: block;
  margin: 0 auto;
  padding: 8px 0;
  background-color: white;
  border: 3px solid #2a2f4f;
  border-top: none;
  border-radius: 0 0 16px 16px;
//   box-shadow: 0 10px 10px rgb(0, 0, 0, 0.3);
  list-style-type: none;
  z-index: 3;
`

const DropDownItem = styled.li`
  padding: 0 16px;
  margin: 10px 0px;

  &.selected {
    // background-color: lightgray;
    color:#2a2f4f;
    font-weight:600
  }
`

export default SearchingHome;
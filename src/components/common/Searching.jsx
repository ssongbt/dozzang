import axios from "axios";
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { parseISO, format } from "date-fns";

const Searching = (props) => {

    
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
                props.getPlayNum(playList.play[choiceIndex].play_num);
                clickDropDownItem(playList.play[choiceIndex].play_name)
                setChoiceIndex(-1)
            }
        }
    }

    useEffect(search, [searchItem]);

    return(
        <div className="search-bar">
            <SearchBox>
                <InputBox haveInputValue={haveInputValue}>
                    <Input type="text" name="search" value ={searchItem||""} onChange={changeInput} onKeyUp={handleDropDownKey} placeholder="공연명을 검색하세요"/>
                    {/* <button>검색</button> */}
                    <DeleteButton onClick={() => {setSearchItem(''); props.Reset()}}>&times;</DeleteButton>
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
                                onClick={() => {clickDropDownItem(play.play_name); props.getPlayNum(play.play_num);}}
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
    
const activeBorderRadius = '3px 3px 0 0'
const inactiveBorderRadius = '3px 3px 3px 3px'

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3px;
  border: 1px solid black;
  width : 100%;
  height : 30px;
  border-radius: ${props =>
    props.haveInputValue ? activeBorderRadius : inactiveBorderRadius};
  z-index: 3;

  &:focus-within {
    // box-shadow: 0 10px 10px rgb(0, 0, 0, 0.3);
  }
`

const Input = styled.input`
  flex: 1 0 0;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 12px;
`

const DeleteButton = styled.div`
  margin-top:1.3%;
  margin-right:1%;
  cursor: pointer;
`
const DropDownBox = styled.ul`
  display: block;
  margin: 0 auto;
  padding: 8px 0;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-top: none;
  border-radius: 0 0 3px 3px;
//   box-shadow: 0 10px 10px rgb(0, 0, 0, 0.3);
  list-style-type: none;
  z-index: 3;
  font-size: 12px;
`

const DropDownItem = styled.li`
  padding: 0 3px;
  margin: 3px 0px;

  &.selected {
    // background-color: lightgray;
    color:#BA90C6;
    font-weight:600
  }
`

const SearchBox = styled.div`
//   padding:10px;
`


export default Searching;
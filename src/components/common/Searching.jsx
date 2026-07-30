import axios from "axios";
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { parseISO, format } from "date-fns";
import searchPlayList from "../../data/searchPlayList.json";

const Searching = (props) => {

    
    const [searchItem, setSearchItem] = useState(props.initialValue || '');
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
            const playList = [...new Map(searchPlayList.map((play) => [play.play_num, play])).values()];
            console.log(playList);
            const filtered = playList.filter((play) => play.play_name.includes(searchItem));
            setPlayList({play:filtered});

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
    
const activeBorderRadius = '10px 10px 0 0'
const inactiveBorderRadius = '10px'

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid ${props => (props.haveInputValue ? 'var(--color-primary)' : 'var(--color-border)')};
  background-color: var(--color-surface);
  width : 100%;
  height : 32px;
  border-radius: ${props =>
    props.haveInputValue ? activeBorderRadius : inactiveBorderRadius};
  transition: border-color 150ms ease, box-shadow 150ms ease;
  z-index: 3;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
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
  color: var(--color-ink);
`

const DeleteButton = styled.div`
  margin-left: 4px;
  cursor: pointer;
  color: var(--color-muted);
  transition: color 150ms ease;

  &:hover {
    color: var(--color-primary);
  }
`
const DropDownBox = styled.ul`
  display: block;
  margin: 0 auto;
  padding: 6px 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-top: none;
  border-radius: 0 0 10px 10px;
  box-shadow: var(--shadow-md);
  list-style-type: none;
  z-index: 3;
  font-size: 12px;
`

const DropDownItem = styled.li`
  padding: 6px 10px;
  margin: 1px 0px;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: var(--color-primary-soft);
  }

  &.selected {
    background-color: var(--color-primary-light);
    color: var(--color-primary-dark);
    font-weight: 600;
  }
`

const SearchBox = styled.div`
//   padding:10px;
`


export default Searching;
import {useEffect, useState} from "react";
import styled from 'styled-components';
import { parseISO, format } from "date-fns";
import {Search} from "react-bootstrap-icons";
import searchPlayList from "../../data/searchPlayList.json";

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
            const playList = [...new Map(searchPlayList.map((play) => [play.play_num, play])).values()];

            const filtered = playList.filter((play) => `${play.play_genre} ${play.play_name}`.includes(searchItem));
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
                clickDropDownItem(playList.play[choiceIndex].play_name)
                setChoiceIndex(-1)
            }
        }

    }

    const searchList = () =>{
        const keyword = searchItem;
        // console.log(encodeURIComponent(keyword));
        
        window.location.href = `#/home/search/${encodeURIComponent(keyword)}`
        
    }

    const searchPlay = (e) =>{
        const playnum =  e;
        window.location.href = `#/home/search/play/${playnum}`;
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
                    <DeleteButton onClick={() => searchList()}><Search className="search-btn" size={18} /></DeleteButton>
                </InputBox>
                {haveInputValue && (
                    <DropDownBox>
                        {playList.play && playList.play.length === 0 && (
                            <DropDownItem>해당하는 공연이 없습니다.</DropDownItem>
                            )}
                        {playList.play && playList.play.map((play, index) =>  {
                            const startDate = play.play_start ? format(parseISO(play.play_start),'yyyy') : null;
                            const endDate = play.play_end ? format(parseISO(play.play_end), 'yyyy') : null;
                            const year = !startDate || !endDate ? '미정' : startDate === endDate ? startDate : `${startDate}-${endDate}`;
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
                                    <GenreBadge>{play.play_genre}</GenreBadge>{play.play_name} ({year})
                                </DropDownItem>
                        )
                    } )}
                    </DropDownBox>
                )}
            </SearchBox>
        </div>

    )
}
    
const activeBorderRadius = '20px 20px 0px 0px'
const inactiveBorderRadius = '20px'

const SearchBox = styled.div`
  width: 100%;
`

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 20px;
  background-color: var(--color-surface);
  border: 2px solid ${props => (props.haveInputValue ? 'var(--color-primary)' : 'var(--color-border)')};
  border-radius: ${props =>
    props.haveInputValue ? activeBorderRadius : inactiveBorderRadius};
  box-shadow: var(--shadow-sm);
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
  font-size: 16px;
  color: var(--color-ink);

  &::placeholder {
    color: var(--color-muted);
  }
`

const DeleteButton = styled.div`
  display: flex;
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
  padding: 8px 0;
  background-color: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-top: none;
  border-radius: 0 0 20px 20px;
  box-shadow: var(--shadow-md);
  list-style-type: none;
  z-index: 3;
`

const DropDownItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 20px;
  margin: 2px 0px;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: var(--color-primary-soft);
  }

  &.selected {
    background-color: var(--color-primary-soft);
    border-left: 3px solid var(--color-primary);
    color: var(--color-primary-dark);
    font-weight: 600;
  }
`

const GenreBadge = styled.span`
  flex: none;
  display: inline-flex;
  align-items: center;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  margin-right: 6px;
`

export default SearchingHome;
import React, {Component} from "react";
import AddStampList from "./AddStampList";


class InputContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            inputItems: [
                {
                    id: 0,
                    benefitNum:'' ,
                    benefit:'',
                    getStartDate:'',
                    getEndDate:'',
                    useStartDate:'',
                    useEndDate:'',
                    url:'',
                    memo:''
                }
            ],
            inputAddId:1
        };
    }

    AddInput = () => {
        const {inputItems, inputAddId} = this.state;

        const input = {
            id: inputAddId,
            benefitNum:'' ,
            benefit:'',
            getStartDate:'',
            getEndDate:'',
            useStartDate:'',
            useEndDate:'',
            url:'',
            memo:''
        };

        this.setState({
            inputItems: inputItems.concat({
                ...input
            }),
            inputAddId : inputAddId + 1 
        })

    };

    InputDelete = (id) => {
        const {inputItems} = this.state;

        this.setState({
            inputItems:[]
        },
        () => {
            this.setState({
                inputItems:inputItems.filter((item) => item.id !== id)
            });
        });
    };

    onChange = (e, id) => {
        const {inputItems} = this.state;
        // console.log(inputItems);

        if(e.target.name  === "benefitNum"){
            e.target.value = e.target.value.replace(/[^0-9]/g,'');
            // console.log(e.target.value);
        }
        // if(e.target.name === "benefitNum" && e.target.value === ""){
        //     window.alert("재관횟수를 입력해주세요.");
        // }

        // if(e.target.name === "benefit" && e.target.value === ""){
        //     window.alert("재관혜택을 입력해주세요.");
        // }

        const data = {
            [e.target.name] : e.target.value,
        };

        this.setState({
            inputItems: inputItems.map((item) =>
                item.id === id ? {...item, ...data} : item
            )
        },()=>{
            this.props.parentFunction(this.state.inputItems);
        });
        
        // console.log(inputItems);
    }

    
    

    render() {
        const {inputItems} = this.state;
        // console.log(inputItems);
        
        return (
            <AddStampList 
                inputItmes={inputItems}
                addInput={this.AddInput}
                InputDelete={this.InputDelete}
                onChange={this.onChange}
            />
        )
    }

}

export default InputContainer;
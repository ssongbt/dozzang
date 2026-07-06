import React, {Component} from "react";
import { useEffect } from "react";
import AddDoubleTurn from "./AddDoubleTurn";
import { format, parseISO } from 'date-fns';

class DoubleInputContainer extends Component {

    constructor(props){
        
        super(props);
        this.state = {
            inputItems:[
                {
                    id:0,
                    date:'',
                    time:''
                }
            ],
            inputAddId:1
        }
    }

    AddInput = () => {
        const {inputItems, inputAddId} = this.state;

        const input = {
            id: inputAddId,
            date:'',
            time:''
        };

        this.setState({
            inputItems: inputItems.concat({
                ...input
            }),
            inputAddId : inputAddId + 1 
        },()=>{

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

    onChange = (name, e, id) => {

        const {inputItems} = this.state;
        
        const data = {
            [name] :e
        }


        this.setState({
            inputItems: inputItems.map((item) =>
                item.id === id ? {...item, ...data} : item
            )
        }, ()=>{
            // console.log("온체인지할때 안되냥...",this.state.inputItems);
            this.props.parentFunction(this.state.inputItems);
        });

    }



    render() {
        const {inputItems} = this.state;
        
        return (
            <AddDoubleTurn
                inputItmes={inputItems}
                addInput={this.AddInput}
                InputDelete={this.InputDelete}
                onChange={this.onChange}
                playStart={this.props.playStart}
                playEnd={this.props.playEnd}
            />
        )
    }

}

export default DoubleInputContainer;

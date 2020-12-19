import React from 'react';
import './App.css';

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <div className="card">
               <img src={this.props.src}></img>
                <div><a href={this.props.url}>{this.props.name}</a></div>
            </div>
        )
    }
}

export default Card;
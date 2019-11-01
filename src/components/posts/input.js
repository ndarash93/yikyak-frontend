import React from 'react';
const axios = require('axios');

class Input extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputText: ''
    }
  }
  
  updatePost = (event) => {
    this.setState({inputText: event.target.value});
    //console.log(this.state.inputText);
  }

  post = (text) => {
    this.props.post(text);
    this.setState({inputText: ''});
    this.refs.input.value = '';
  }

  render(){
    return(
      <div className="input">
        <input type="text" name="post" ref="input" id="post" className="inputText" onChange={this.updatePost} />
        <button className="inputBtn" onClick={() => this.post(this.state.inputText)} >Post</button>
      </div>
    )
  };
}

export default Input;

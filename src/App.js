import React from 'react';
import Post from './components/posts/post';
import Navbar from './components/navbar/navbar';
import './app.css';
import axios from 'axios';
//const https = require('https');

import Cookie from 'universal-cookie';

const cookie = new Cookie();

//cookies.set('myCat', 'Pacman', { path: '/' });
//console.log(cookies.get('myCat'));

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      user: null,
      general: {
        domain: 'http://192.168.0.31',
        port: '27817',
        jwt: null
      }
    }
  }
  
  componentDidMount(){
    if(!this.state.general.jwt){
      if(!cookie.get('jwt')){
        axios.post('http://192.168.0.31:27817/api/auth', {
          email: 'nickdarash@gmail.com',
          password: 'pepsi1'
        }).then((res) => {
          this.setState({
            user: {
              email: res.data.email,
              id: res.data.id
            },
            jwt: res.data.jwt
          });
          cookie.set('jwt', res.data.jwt, {path: '/'});
        }).catch((err) => {
          if (err) throw err;
        });
      }else{
        this.setState({general: {...this.state.general, jwt: cookie.get('jwt')}})
      }
    }
  }

  componentDidUpdate(){
    
  }

  render(){
    return(
      <div className="App">
        <Navbar name="YikYak" general={this.state.general} />
        <Post posts={this.state.posts} general={this.state.general} />
      </div>
    )
  };
}

export default App;

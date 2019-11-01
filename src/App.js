import React from 'react';
import Post from './components/posts/post';
import Navbar from './components/navbar/navbar';
import './app.css';
import axios from 'axios';
//const https = require('https');

import Cookie from 'universal-cookie';

const cookie = new Cookie();

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      posts: [],
      user: {},
      general: {
        domain: 'http://192.168.0.31:27817',
        jwt: null
      }
    }
  }
  
  componentDidMount(){
    if(!this.state.general.jwt){
      if(!cookie.get('jwt')){
        axios.post(`${this.state.general.domain}/api/auth`, {
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

  getLikedPosts = (oldestPost) => {
    axios.post(`${this.state.general.domain}/api/private/profile/liked`,
    {
      timeStamp: oldestPost.timeStamp
    },
    {
      headers: {
        jwt: this.state.general.jwt
      },
    })
    .then((res) => {
      this.setState({user: {...this.state.user, likedPosts: res.data}})
    })
    .catch((err) => {
      if(err) throw err;
    });
  }

  getDislikedPosts = (oldestPost) => {
    axios.post(`${this.state.general.domain}/api/private/profile/disliked`,
    {
      timeStamp: oldestPost.timeStamp
    },
    {
      headers: {
        jwt: this.state.general.jwt
      },
    })
    .then((res) => {
      this.setState({user: {...this.state.user, dislikedPosts: res.data}})
    })
    .catch((err) => {
      if(err) throw err;
    });
  }

  render(){
    return(
      <div className="App">
        <Navbar name="YikYak" general={this.state.general} />
        <Post posts={this.state.posts} general={this.state.general} getLikedPosts={this.getLikedPosts} getDislikedPosts={this.getDislikedPosts} />
      </div>
    )
  };
}

export default App;

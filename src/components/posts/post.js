import React from 'react';
import axios from 'axios';
import Input from './input';
import './posts.css';

class Post extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      postInfo: {
        posts: [],
        postsAvailable: true
      }
    }
  }
  
  post = (text) => {
    axios.post('http://192.168.0.31:27817/api/private/posts', {
      postText: text,
      location: 'TBD'
    },
    {
      headers: {
        jwt: this.props.general.jwt
      },
      
    })
    .then(res => {
      this.setState({posts: this.state.postInfo.posts.unshift(res.data.post)});
    })
    .catch((err) => {
      if(err) throw err;
    });
  }
  
  fetchPosts = () => {
    axios.get(`${this.props.general.domain}:${this.props.general.port}/api/public/posts`).then((result) => {
      this.setState({postInfo: {...this.state.postInfo, posts: result.data.posts}});
    }).catch((err) => {
      if (err) throw err;
    });
  }

  componentDidUpdate = () => {
    if(!this.state.postInfo.posts.length && this.state.postInfo.postsAvailable){
      this.fetchPosts(); 
      setInterval( _ => {
        this.fetchPosts();
      }, 30000);
      if(!this.state.postInfo.posts.length){
        this.setState({postInfo: {...this.state.postInfo, postsAvailable: false}});
      }
    }
  }

  postDiff = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const minutes = (currentDate.getTime() - postDate.getTime())/60000;
    const seconds = (currentDate.getTime() - postDate.getTime())/1000;
    if(minutes>525600){
      return `${Math.floor(minutes/525600)} years ago`;
    }else if(minutes>43200){
      return `${Math.floor(minutes/43200)} months ago`;
    }else if(minutes>1440){
      return `${Math.floor(minutes/1440)} days ago`;
    }else if(minutes>60){
      return `${Math.floor(minutes/60)} hours ago`;
    }else if(minutes){
      return `${Math.floor(minutes)} minutes ago`;
    }else if(seconds>30){
      return `${Math.floor(seconds)} seconds ago`;
    }else{
      return `just now`;
    }
  }

  like = (id) => {
    axios.put(`${this.props.general.domain}:${this.props.general.port}/api/private/posts/like`,
      {
        id: id
      },
      {
        headers: {
          jwt: this.props.general.jwt
        }
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if(err) throw err;
      }
    );
  }

  dislike = (id) => {
    console.log(id);
  }

  render(){
    return(
      <div className="posts">
        <Input general={this.props.general} post={this.post} />
        {this.state.postInfo.posts.map((post) => {
          return(
            <div className="post" key={post._id}>
              <p className="diff">{this.postDiff(post.timeStamp)}</p>
              <p className="text">{post.text}</p>
              <button className="like" onClick={() => this.like(post._id)} >+</button>
              <button className="dislike" onClick={() => this.dislike(post._id)} >-</button>
              <p className="likes">{post.likes}</p>
            </div>
          );
        })
      }
      </div>
    )
  }
}

export default Post;

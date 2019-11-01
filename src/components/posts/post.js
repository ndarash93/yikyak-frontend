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
    axios.post(`${this.props.general.domain}/api/private/posts`, {
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
    axios.get(`${this.props.general.domain}/api/public/posts`).then((result) => {
      this.setState({postInfo: {...this.state.postInfo, posts: result.data.posts}});
      this.props.getLikedPosts(result.data.posts[result.data.posts.length-1]);
    }).catch((err) => {
      if (err) throw err;
    });
  }

  componentDidMount = () => {
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
    const minutes = Math.floor((currentDate.getTime() - postDate.getTime())/60000);
    const seconds = (currentDate.getTime() - postDate.getTime())/1000;
    if(minutes>525600){
      return `${Math.floor(minutes/525600)} years ago`;
    }else if(minutes>43200){
      return `${Math.floor(minutes/43200)} months ago`;
    }else if(minutes>1440){
      return `${Math.floor(minutes/1440)} days ago`;
    }else if(minutes>60){
      return `${Math.floor(minutes/60)} hours ago`;
    }else if(minutes>0){
      return `${Math.floor(minutes)} minutes ago`;
    }else if(seconds>30){
      return `${Math.floor(seconds)} seconds ago`;
    }else{
      return `just now`;
    }
  }

  like = (id) => {
    axios.put(`${this.props.general.domain}/api/private/posts/like`,
      {
        id: id
      },
      {
        headers: {
          jwt: this.props.general.jwt
        }
      })
      .then((res) => {
        let index = null;
        this.state.postInfo.posts.filter((post, i, self) => {
          if(post._id === res.data.post.id){
            return index = i;
          }
          return null
        });
        let tempPosts = this.state.postInfo.posts;
        let tempPost = tempPosts[index];
        tempPost = {...tempPost, likes: tempPost.likes+res.data.post.inc};
        tempPosts[index] = tempPost;
        this.setState({postInfo: {...this.state.postInfo, posts: tempPosts}});
      })
      .catch((err) => {
        if(err) throw err;
      }
    );
  }

  dislike = (id) => {
    axios.put(`${this.props.general.domain}/api/private/posts/dislike`,
      {
        id: id
      },
      {
        headers: {
          jwt: this.props.general.jwt
        }
      })
      .then((res) => {
        let index = null;
        this.state.postInfo.posts.filter((post, i, self) => {
          if(post._id === res.data.post.id){
            return index = i;
          }
          return null
        });
        let tempPosts = this.state.postInfo.posts;
        let tempPost = tempPosts[index];
        tempPost = {...tempPost, likes: tempPost.likes+res.data.post.inc};
        tempPosts[index] = tempPost;
        this.setState({postInfo: {...this.state.postInfo, posts: tempPosts}});
      })
      .catch((err) => {
        if(err) throw err;
      }
    );
  }

  render(){
    return(
      <div className="posts">
        <Input general={this.props.general} post={this.post} />
        {this.state.postInfo.posts.map((post) => {
          return(
            <div className="post" key={post._id} >
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
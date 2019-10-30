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
      this.setState({posts: this.state.postInfo.posts.push(res.data.post)});
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


  render(){
    return(
      <div className="posts">
        <Input general={this.props.general} post={this.post} />
        {this.state.postInfo.posts.map((post) => {
          return(
            <div className="post" key={post._id}>
              <p>{post.text}</p>
            </div>
          );
        })
      }
      </div>
    )
  }
}

export default Post;

import React from "react";
import Post from "../../components/Post/Post";
import {gql, useQuery} from '@apollo/client'
import {Spinner} from "react-bootstrap";

const GET_POSTS = gql`
  query {
    posts {
      userErrors {
        message
      }
      posts {
        title
        content
        createdAt
        user {
          id
          name
        }
      }
    }
  }

`;

export default function Posts() {

  const {data, error, loading} = useQuery(GET_POSTS);

  console.log({data, error, loading})

  if (error) {
    return <div>Error Page</div>
  }

  if (loading) {
    return <div><Spinner  animation={"border"}/></div>
  }

  const {posts} = data;
  return (
    <div>
      {
        posts.posts.map(post => <Post
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          date={post.createdAt}
          user={post.user.name}
        />)
      }
    </div>
  );
}

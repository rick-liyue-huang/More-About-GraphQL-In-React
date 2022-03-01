import React from "react";
import "./Post.css";
import {gql, useMutation} from "@apollo/client";

const PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!) {
    postPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
        published
      }
    }
  }
`;

const UN_PUBLISH_POST = gql`
  mutation UnPublishPost($postId: ID!) {
    postUnPublish(postId: $postId) {
      userErrors {
        message
      }
      post {
        title
        published
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [publishPost, {data, loading}] = useMutation(PUBLISH_POST);
  const [unPublishPost, {data: unpublishData, loading: unpublishLoading}] = useMutation(UN_PUBLISH_POST);

  const formatedDate = new Date(Number(date));
  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "lightblue" } : {}}
    >
      {isMyProfile && published === false && (
        <p className="Post__publish" onClick={() => {
          publishPost({
            variables: {
              postId: id,
            }
          })
        }}>
          publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p className="Post__publish" onClick={() => {
          unPublishPost({
            variables: {
              postId: id
            }
          })
        }}>
          unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}

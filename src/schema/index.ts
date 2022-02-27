import {gql} from "apollo-server";

export const typeDefs = gql`
    
    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt : String!
        published: Boolean!
        user: User!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
#        password: String!  should not query password and return to exposed
        profile: Profile!
        posts: [Post!]!
    }
    
    type Profile {
        id: ID!
        bio: String!
        user: User!
    }
    
    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type PostsPayload {
        userErrors: [UserError!]!
        posts: [Post!]!
    }
    
    type AuthPayload {
        userErrors: [UserError!]!
        user: User
    }
    
    type UserError {
        message: String!
    }

    input PostInput {
        title: String
        content: String
    }

    type Query {
        posts: PostsPayload!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId: ID!, post: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
				signUp(email: String!, name: String!, password: String!, bio: String!): AuthPayload!
				
    }
    
  
    
`;


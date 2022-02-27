import {gql} from "apollo-server";

export const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }
    
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
    
    type UserError {
        message: String!
    }
    
    type Mutation {
        postCreate(title: String!, content: String!): PostPayload!
    }
		
		type Story {
				id: ID!
				name: String!
				content: String!
		}
    
`;



import { ApolloServer, gql } from 'apollo-server';
import {typeDefs} from "./schema";
import {Query} from "./resolvers";



// create the apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query
	}
});

server.listen().then(({url}) => {
	console.log(`Server is running on ${url}`);
})

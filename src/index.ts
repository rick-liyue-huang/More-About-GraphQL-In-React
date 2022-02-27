
import { ApolloServer } from 'apollo-server';
import {typeDefs} from "./schema";
import {Mutation, Query} from "./resolvers";
import {PrismaClient, Prisma} from '@prisma/client';

// define the Context interface
export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>;
}

const prisma = new PrismaClient();


// create the apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation
	},
	context: {
		prisma
	}
});

server.listen().then(({url}) => {
	console.log(`Server is running on ${url}`);
})

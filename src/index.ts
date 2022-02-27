
import { ApolloServer, gql } from 'apollo-server';
import {typeDefs} from "./schema";
import {Mutation, Query} from "./resolvers";
import {PrismaClient, Prisma} from '@prisma/client';

const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
}

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

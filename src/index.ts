
import { ApolloServer } from 'apollo-server';
import {typeDefs} from "./schema";
import {PrismaClient, Prisma} from '@prisma/client';
import {Mutation, Query} from "./resolvers";
import {getUserFromToken} from "./utils/getUserFromToken";
import {assertWrappingType} from "graphql";

// define the Context interface
export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>;
	userInfo: {
		userId: number;
	} | null;
}

const prisma = new PrismaClient();


// create the apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation
	},
	context: async ({req}: any): Promise<Context> => {
		console.log('---------------------', req.headers.authorization);
		const userInfo = await getUserFromToken(req.headers.authorization)
		return {
			prisma,
			userInfo
		}
	}
});

server.listen().then(({url}) => {
	console.log(`Server is running on ${url}`);
})

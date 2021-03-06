
import { ApolloServer } from 'apollo-server';
import {typeDefs} from "./schema";
import {PrismaClient, Prisma} from '@prisma/client';
import {Mutation, Query, Profile, Post, User} from "./resolvers";
import {getUserFromToken} from "./utils/getUserFromToken";


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

export const prisma = new PrismaClient();


// create the apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
		Profile,
		Post,
		User
	},
	context: async ({req}: any): Promise<Context> => {
		// console.log('---------------------', req.headers.authorization);
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

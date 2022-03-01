import {Context} from "../index";
import {Post, Prisma} from "@prisma/client";
import {defineArguments} from "graphql/type/definition";

interface PostsPayloadType {
	userErrors: {
		message: string
	}[],
	posts: Post[] | Prisma.Prisma__PostClient<Post[]> | null
}

export const Query = {
		posts: async (parent: any, args: any, {prisma}: Context): Promise<PostsPayloadType> => {

			/*const posts = await prisma.post.findMany({
				orderBy: [
					{
						createdAt: 'desc'
					},
					{
						title: 'asc'
					}
				]
			})*/

			return {
				userErrors: [],
				posts: await prisma.post.findMany({
					where: {
						published: true
					},
					orderBy: [
						{
							createdAt: 'desc'
						},
						{
							title: 'asc'
						}
					]
				})
			};
		},

		me: (parent: any, args: any, {userInfo, prisma}: Context) => {

			if (!userInfo) return null;

			return prisma.user.findUnique({
				where: {
					id: userInfo.userId
				}
			})
		},

	profile: async (parent: any, {userId}: {userId: string}, {prisma, userInfo}: Context) => {
		//	here we donot need to add authorization, because profile is opened to others

		const isMyProfile = Number(userId) === userInfo?.userId

		const profile = await prisma.profile.findUnique({
			where: {
				userId: Number(userId)
			}
		});

		if(!profile) return null;

		return {
			...profile,
			isMyProfile
		}
	}
}


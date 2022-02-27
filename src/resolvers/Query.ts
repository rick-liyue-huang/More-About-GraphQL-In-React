import {Context} from "../index";
import {Post} from "@prisma/client";

interface PostsPayloadType {
	userErrors: {
		message: string
	}[],
	posts: Post[] | null
}

export const Query = {
		posts: async (parent: any, args: any, {prisma}: Context): Promise<PostsPayloadType> => {

			const posts = await prisma.post.findMany({
				orderBy: [
					{
						createdAt: 'desc'
					},
					{
						title: 'asc'
					}
				]
			});
			return {
				userErrors: [],
				posts
			};
		}
	}


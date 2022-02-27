import { Post } from "@prisma/client";
import {Context} from "../index";

interface PostCreateArgs {
	title: string;
	content: string;
}

interface PostPayloadType {
	userErrors: {
		message: string
	}[],
	post: Post | null
}

export const Mutation = {

	// match with the mutation type in schema
	postCreate: async (parent: any, {title, content}: PostCreateArgs, {prisma}: Context): Promise<PostPayloadType> => {

		if (!title || !content) {
			return {
				userErrors: [{
					message: 'you should provide the title and content to create a post'
				}],
				post: null
			}
		}

		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId: 1
			}
		});

		return {
			userErrors: [],
			post: post
		};

	},



}

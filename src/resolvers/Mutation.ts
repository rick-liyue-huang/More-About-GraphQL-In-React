import {Post, Prisma} from "@prisma/client";
import {Context} from "../index";

interface PostArgs {
	post: {
		title?: string;
		content?: string;
	}
}

interface PostPayloadType {
	userErrors: {
		message: string
	}[],
	post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const Mutation = {

	// match with the mutation type in schema
	postCreate: async (parent: any, {post}: PostArgs, {prisma}: Context): Promise<PostPayloadType> => {

		const {title, content} = post;
		if (!title || !content) {
			return {
				userErrors: [{
					message: 'you should provide the title and content to create a post'
				}],
				post: null
			}
		}

		return {
			userErrors: [],
			post: prisma.post.create({
				data: {
					title,
					content,
					authorId: 1
				}
			})
		};

	},

	postUpdate: async (parent: any, {postId, post}: {postId: String, post: PostArgs['post']}, {prisma}: Context): Promise<PostPayloadType> => {
		const {title, content} = post;

		if (!title && !content) {
			return {
				userErrors: [
					{message: 'title or content need update'}
				],
				post: null
			}
		}

		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [
					{message: 'post doesn\'t exist'}
				],
				post: null
			}
		}

		let payloadToUpdate = {
			title,
			content
		}

		if (!title) delete payloadToUpdate.title;
		if (!content) delete payloadToUpdate.content;

		return {
			userErrors: [],
			post: prisma.post.update({
				data: {
					...payloadToUpdate
				},
				where: {
					id: Number(postId)
				}
			})
		}
	},

	postDelete: async (parent: any, {postId}: {postId: string}, {prisma}: Context): Promise<PostPayloadType> => {
		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [
					{message: 'post doesn\'t exist'}
				],
				post: null
			}
		}

		await prisma.post.delete({
			where: {
				id: Number(postId)
			}
		});

		return {
			userErrors: [],
			post: existingPost
		}
	}

}

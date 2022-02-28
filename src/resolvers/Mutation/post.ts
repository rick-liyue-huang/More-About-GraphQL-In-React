import {Context} from "../../index";
import {Post, Prisma} from "@prisma/client";
import {canUserMutatePost} from "../../utils/canUserMutatePost";

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


export const postResolvers = {

	postCreate: async (parent: any, {post}: PostArgs, {prisma, userInfo}: Context): Promise<PostPayloadType> => {

		// check the userinfo is null
		if (!userInfo) {
			return {
				userErrors: [{message: 'forbidden access as unauthenticated'}],
				post: null
			}
		}


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
					// authorId: 1
					// add authorization
					authorId: userInfo.userId
				}
			})
		};

	},

	postUpdate: async (parent: any, {postId, post}: {postId: String, post: PostArgs['post']}, {prisma, userInfo}: Context): Promise<PostPayloadType> => {

		// check the userinfo is null
		if (!userInfo) {
			return {
				userErrors: [{message: 'forbidden access as unauthenticated'}],
				post: null
			}
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma
		});

		if (error) return error;

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

	postDelete: async (parent: any, {postId}: {postId: string}, {prisma, userInfo}: Context): Promise<PostPayloadType> => {

		// check the userinfo is null
		if (!userInfo) {
			return {
				userErrors: [{message: 'forbidden access as unauthenticated'}],
				post: null
			}
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma
		});

		if (error) return error;


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
	},


	postPublish: async (parent: any, {postId}: {postId: string}, {prisma, userInfo}: Context): Promise<PostPayloadType> => {


		// check the userinfo is null
		if (!userInfo) {
			return {
				userErrors: [{message: 'forbidden access as unauthenticated'}],
				post: null
			}
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma
		});

		if (error) return error;

		return {
			userErrors: [],
			post: prisma.post.update({
				where: {
					id: Number(postId)
				},
				data: {
					published: true
				}
			})
		}

	},

	postUnPublish: async (parent: any, {postId}: {postId: string}, {prisma, userInfo}: Context): Promise<PostPayloadType> => {


		// check the userinfo is null
		if (!userInfo) {
			return {
				userErrors: [{message: 'forbidden access as unauthenticated'}],
				post: null
			}
		}

		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma
		});

		if (error) return error;

		return {
			userErrors: [],
			post: prisma.post.update({
				where: {
					id: Number(postId)
				},
				data: {
					published: false
				}
			})
		}

	},



}

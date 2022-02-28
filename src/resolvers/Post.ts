import {Context} from "../index";

interface PostParentType {
	authorId: number;
}

export const Post = {
	user: (parent: PostParentType, args: any, {prisma, userInfo}: Context) => {
		return prisma.user.findUnique({
			where: {
				id: parent.authorId
			}
		})
	}
}

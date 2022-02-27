import {Context} from "../../index";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import {Post, Prisma, User} from "@prisma/client";

// authentication
interface SingUpArgs {
	email: string;
	name: string;
	bio: string;
	password: string
}

interface UserPayloadType {
	userErrors: {
		message: string
	}[],
	user: User | Prisma.Prisma__PostClient<User> | null
}

export const authResolvers = {
	signUp: async (parent: any, {email, name, bio, password}: SingUpArgs, {prisma}: Context): Promise<UserPayloadType> => {

		const isEmail = validator.isEmail(email);
		const isValidPassword = validator.isLength(password, {min: 6});

		if (!isEmail) {
			return {
				userErrors: [{message: 'its invalid email format'}],
				user: null
			}
		}

		if (!isValidPassword) {
			return {
				userErrors: [{message: 'password length at least 6'}],
				user: null
			}
		}

		if (!name || !bio) {
			return {
				userErrors: [{message: 'need name and bio'}],
				user: null
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		return {
			userErrors: [],
			user: await prisma.user.create({
				data: {
					email,
					name,
					password: hashedPassword
				}
			})
		}

	}
}

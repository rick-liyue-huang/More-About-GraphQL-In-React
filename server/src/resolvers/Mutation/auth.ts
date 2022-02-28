import {Context} from "../../index";
import validator from 'validator'
import bcrypt from 'bcryptjs';
import JWT from "jsonwebtoken";
import {Post, Prisma, User} from "@prisma/client";
import {JWT_SIGNATURE} from "../../.keys";

// authentication
interface SignUpArgs {
	credentials: {
		email: string;
		password: string
	}
	bio: string;
	name: string;
}

interface SignInArgs {
	credentials: {
		email: string;
		password: string
	};
}

interface UserPayloadType {
	userErrors: {
		message: string
	}[];
	token: string | null;
	// user: User | Prisma.Prisma__PostClient<User> | null
}

export const authResolvers = {
	signUp: async (parent: any, {credentials, name, bio}: SignUpArgs, {prisma}: Context): Promise<UserPayloadType> => {

		const {email, password} = credentials;

		const isEmail = validator.isEmail(email);
		const isValidPassword = validator.isLength(password, {min: 6});

		if (!isEmail) {
			return {
				userErrors: [{message: 'its invalid email format'}],
				token: null
			}
		}

		if (!isValidPassword) {
			return {
				userErrors: [{message: 'password length at least 6'}],
				token: null
			}
		}

		if (!name || !bio) {
			return {
				userErrors: [{message: 'need name and bio'}],
				token: null
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword
			}
		});

		await prisma.profile.create({
			data: {
				bio,
				userId: user.id
			}
		})

		const token = JWT.sign({
			userId: user.id,
			email: user.email
		}, JWT_SIGNATURE, {expiresIn: 3600000})

		return {
			userErrors: [],
			token
		}

	},

	signIn: async (parent: any, {credentials}: SignInArgs, {prisma}: Context): Promise<UserPayloadType> => {
		const {email, password} = credentials;

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return {
				userErrors: [{message: 'user isn\'t exist'}],
				token: null
			}
		}

		const isMatched = await bcrypt.compare(password, user.password);

		if (!isMatched) {
			return {
				userErrors: [{message: 'token isn\'t exist or match'}],
				token: null
			}
		}

		return {
			userErrors: [],
			token: JWT.sign({userId: user.id}, JWT_SIGNATURE, {expiresIn: 3600000})
		}
	}
}

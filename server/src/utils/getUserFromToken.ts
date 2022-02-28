import JWT from "jsonwebtoken";
import {JWT_SIGNATURE} from "../.keys";


export const getUserFromToken = (token: string) => {
	try {
		return JWT.verify(token, JWT_SIGNATURE) as {
			userId: number
		}
	} catch (err) {
		return null;
	}

}

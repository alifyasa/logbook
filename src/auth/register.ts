import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from './constants';
import { isExistUser } from './utils';

export async function register(dbBinding: D1Database, username: string, password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const userExist = await isExistUser(dbBinding, username)
    if (userExist) {
        return false
    }

    const dbInsertResponse = await dbBinding
        .prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?);")
        .bind(username, passwordHash)
        .run()
    
    return dbInsertResponse.success
}
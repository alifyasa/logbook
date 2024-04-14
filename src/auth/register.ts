import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from './constants';

export async function register(dbBinding: D1Database, username: string, password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const dbSelectResponse = await dbBinding
        .prepare("SELECT username, passwordHash FROM users WHERE username = ?;")
        .bind(username)
        .all()

    const dbRecord = dbSelectResponse.results.filter(record => record.username === username)

    if (dbRecord.length !== 0) {
        return false
    }

    const dbInsertResponse = await dbBinding
        .prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?);")
        .bind(username, passwordHash)
        .run()
    
    return dbInsertResponse.success
}
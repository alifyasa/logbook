import bcrypt from 'bcryptjs';

export async function login(dbBinding: D1Database, username: string, password: string) {
    const dbResponse = await dbBinding
        .prepare("SELECT username, passwordHash FROM users WHERE username = ?;")
        .bind(username)
        .all()

    const dbRecord = dbResponse.results.find(record => record.username === username)

    if (dbRecord) {
        const { passwordHash } = dbRecord
        const compareResult = await bcrypt.compare(password, passwordHash as string)
        return compareResult
    }

    return false
}
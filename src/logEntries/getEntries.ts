import { LogEntry } from "./utils"

export async function getEntries(
    dbBinding: D1Database, 
    username: string,
    offset: number
) {
    const dbSelectResponse = await dbBinding
        .prepare("SELECT * FROM log_entries WHERE username = ? ORDER BY id DESC LIMIT 5 OFFSET ?;")
        .bind(username, offset)
        .all()
    
    return dbSelectResponse.results.toReversed() as unknown as LogEntry[]
}
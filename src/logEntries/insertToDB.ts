import { nanoid } from "nanoid"

export async function insertToDB(
    dbBinding: D1Database, 
    entryMessage: string, 
    entryTimestamp: string,
    username: string
) {
    const dbInsertResponse = await dbBinding
        .prepare("INSERT INTO log_entries (unique_id, entry_timestamp, entry_message, username) VALUES (?, ?, ?, ?);")
        .bind(nanoid(), entryTimestamp, entryMessage, username)
        .run()

    return dbInsertResponse.success
}
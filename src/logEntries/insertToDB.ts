export async function insertToDB(
    dbBinding: D1Database, 
    entryMessage: string, 
    entryTimestamp: string,
    username: string
) {
    const dbInsertResponse = await dbBinding
        .prepare("INSERT INTO log_entries (entryTimestamp, entryMessage, username) VALUES (?, ?, ?);")
        .bind(entryTimestamp, entryMessage, username)
        .run()

    return dbInsertResponse.success
}
from lib.db import get_cursor

def submit_report(user_id: int, subject: str, content: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO reports (user_id, subject, content) VALUES (%s, %s, %s) RETURNING id",
            (user_id, subject, content)
        )
        return cursor.fetchone()[0]

def get_reports_by_user(user_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports WHERE user_id = %s", (user_id,))
        return cursor.fetchall()

def get_unread_reports():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM reports WHERE read = FALSE")
        return cursor.fetchall()

def mark_report_as_read(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("UPDATE reports SET read = TRUE WHERE id = %s", (report_id,))
        return cursor.rowcount > 0

def delete_report(report_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM reports WHERE id = %s", (report_id,))
        return cursor.rowcount > 0
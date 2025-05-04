from lib.db import get_cursor


def get_course_by_id(course_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM courses WHERE id = %s", (course_id,))
        return cursor.fetchone()
    
def get_all_courses():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM courses")
        return cursor.fetchall()

def insert_course(title: str, description: str, level: str, duration: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO courses (title, description, level, duration) VALUES (%s, %s, %s, %s) RETURNING id",
            (title, description, level, duration)
        )
        return cursor.lastrowid
    
def update_course_by_id(course_id: int,title: str, description: str, level :str, duration:str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE courses SET title = %s, description = %s, level = %s, duration = %s WHERE id = %s",
            (title, description, level, duration, course_id)
        )
        cursor.execute()
        return cursor.rowcount > 0

def delete_course_by_id(course_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM courses WHERE id = %s", (course_id,))
        return cursor.rowcount > 0
    
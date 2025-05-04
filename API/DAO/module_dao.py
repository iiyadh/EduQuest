from lib.db import get_cursor


def get_modules_by_course_id(course_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM module WHERE course_id = %s", (course_id,))
        return cursor.fetchall()

def insert_module(title: str, course_id: int):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO module (title, course_id) VALUES (%s, %s) RETURNING id",
            (title, course_id)
        )
        return cursor.fetchone()[0]

def update_module_by_id(module_id: int, title: str,):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE module SET title = %s WHERE id = %s",
            (title, module_id)
        )
        return cursor.rowcount > 0

def delete_module_by_id(module_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM module WHERE id = %s", (module_id,))
        return cursor.rowcount > 0
    

    

from lib.db import get_cursor

def get_all_departments():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM department")
        return cursor.fetchall()

def get_department_by_id(dept_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM department WHERE id = %s", (dept_id,))
        return cursor.fetchone()

def insert_department(name: str, description: str):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO department (name, description) VALUES (%s, %s) RETURNING id",
            (name, description)
        )
        return cursor.fetchone()[0]

def update_department(dept_id: int, name: str, description: str):
    with get_cursor() as cursor:
        cursor.execute(
            "UPDATE department SET name = %s, description = %s WHERE id = %s",
            (name, description, dept_id)
        )
        return cursor.rowcount > 0

def delete_department(dept_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM department WHERE id = %s", (dept_id,))
        return cursor.rowcount > 0

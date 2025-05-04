from lib.db import get_cursor

def get_student_by_email(email: str):
    with get_cursor() as cursor:
        cursor.execute("SELECT id , password ,is_blocked FROM students WHERE email = %s", (email,))
        return cursor.fetchone()
    
def get_student_by_id(student_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT id, email ,is_blocked  FROM students WHERE id = %s", (student_id,))
        return cursor.fetchone()
    
def get_students_by_department(department_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT id, email ,is_blocked FROM students WHERE department_id = %s", (department_id,))
        return cursor.fetchall()

def insert_student(email: str, password: str, department_id: int, username: str):
    with get_cursor() as cursor:
        cursor.execute("INSERT INTO students (email, password, department_id,username) VALUES (%s, %s, %s,%s) RETURNING id", (email, password, department_id,username))
        return cursor.lastrowid

def update_email_name_by_id(student_id: int, email: str, username: str):
    with get_cursor() as cursor:
        cursor.execute("UPDATE students SET email = %s , username = %s WHERE id = %s", (email, username, student_id))
        return cursor.rowcount > 0
    
def update_bio_by_id(student_id: int, about: str):
    with get_cursor() as cursor:
        cursor.execute("UPDATE students SET about = %s WHERE id = %s", (about, student_id))
        return cursor.rowcount > 0
    
def change_status_student_by_id(student_id: int, status: bool):
    with get_cursor() as cursor:
        cursor.execute("UPDATE students SET is_blocked = %s WHERE id = %s", (student_id,status,))
        return cursor.rowcount > 0

def delete_student_by_id(student_id: int):
    with get_cursor() as cursor:
        cursor.execute("DELETE FROM students WHERE id = %s", (student_id,))
        return cursor.rowcount > 0

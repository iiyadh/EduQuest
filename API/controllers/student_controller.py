from fastapi import HTTPException
from DAO import student_dao


def change_status_student_by_id(student_id: int, status: bool):
    updated = student_dao.change_status_student_by_id(student_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Student status updated successfully"}

def update_student_email_name_by_id(student_id: int, email: str, username: str):
    updated = student_dao.update_email_name_by_id(student_id, email, username)
    if not updated:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Student email and name updated successfully"}

def update_student_bio_by_id(student_id: int, about: str):
    updated = student_dao.update_bio_by_id(student_id, about)
    if not updated:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Student bio updated successfully"}

def delete_student(student_id: int):
    deleted = student_dao.delete_student_by_id(student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Delete failed")
    return {"message": "Student deleted successfully"}
from fastapi import HTTPException
from DAO import student_dao

def block_student(student_id: int):
    success = student_dao.change_status_student_by_id(student_id, True)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student blocked successfully"}

def unblock_student(student_id: int):
    success = student_dao.change_status_student_by_id(student_id, False)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student unblocked successfully"}\

def delete_student(student_id: int):
    success = student_dao.delete_student_by_id(student_id)
    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}
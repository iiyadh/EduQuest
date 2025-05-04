from fastapi import HTTPException
from DAO import enrollment_dao


def enroll_user_in_course(user_id: int, course_id: int):
    success = enrollment_dao.enroll_user(course_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="User already enrolled or insert failed")
    return {"message": "Enrollment successful"}

def get_enrollments_by_user(user_id: int):
    enrollments = enrollment_dao.get_user_enrollments(user_id)
    if not enrollments:
        raise HTTPException(status_code=404, detail="No enrollments found")
    return enrollments

def update_last_activity(user_id: int, course_id: int, lesson_id: int):
    updated = enrollment_dao.update_enrollment_progress(course_id, user_id, lesson_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Last activity updated"}

def delete_enrollment(user_id: int, course_id: int):
    deleted = enrollment_dao.unenroll_user(course_id, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Enrollment deleted successfully"}

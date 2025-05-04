from fastapi import HTTPException
from DAO import course_dao , module_dao , lesson_dao
from models.course_models import Course

def create_course():
    new_course_id = course_dao.insert_course("New Course", "Some Description", "beginner", "4 weeks")
    return new_course_id

def get_course_by_id(course_id: int):
    course = course_dao.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

def get_all_courses() -> list[Course]:
    courses = course_dao.get_all_courses()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")
    for course in courses:
        modules = module_dao.get_modules_by_course_id(course["id"]) or []
        for module in modules:
            module["lessons"]= lesson_dao.get_lessons_by_module_id(module["id"]) or []
        course["modules"] = modules
    return courses

def add_module_to_course(course_id: int):
    new_module_id = module_dao.insert_module("New Module", course_id)
    return new_module_id

def add_lesson_to_module(module_id: int):
    new_lesson_id = lesson_dao.insert_lesson("New Lesson", "Lesson Content", module_id)
    return new_lesson_id

def update_course(course_id: int, title: str, description: str, level: str, duration: str):
    updated = course_dao.update_course_by_id(course_id, title, description, level, duration)
    if not updated:
        raise HTTPException(status_code=404, detail="Course not found or update failed")
    return {"message": "Course updated successfully"}

def delete_course(course_id: int):
    deleted = course_dao.delete_course_by_id(course_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Course not found or delete failed")
    return {"message": "Course deleted successfully"}

def update_module(module_id: int, title: str):
    updated = module_dao.update_module_by_id(module_id, title)
    if not updated:
        raise HTTPException(status_code=404, detail="Module not found or update failed")
    return {"message": "Module updated successfully"}

def delete_module(module_id: int):
    deleted = module_dao.delete_module_by_id(module_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Module not found or delete failed")
    return {"message": "Module deleted successfully"}

def update_lesson(lesson_id: int, title: str, content: str):
    updated = lesson_dao.update_lesson_by_id(lesson_id, title, content)
    if not updated:
        raise HTTPException(status_code=404, detail="Lesson not found or update failed")
    return {"message": "Lesson updated successfully"}

def delete_lesson(lesson_id: int):
    deleted = lesson_dao.delete_lesson_by_id(lesson_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lesson not found or delete failed")
    return {"message": "Lesson deleted successfully"}
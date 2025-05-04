from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from controllers import course_controller, department_controller
from models.course_models import Course

router = APIRouter()

# Student management endpoints

# Course management endpoints
@router.post("/courses")
async def create_course():
    try:
        response = course_controller.create_course()
        return JSONResponse(content={"id": response}, status_code=201)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.put("/courses/{course_id}")
async def update_course(course_id: int, title: str, description: str, level: str, duration: str):
    try:
        response = course_controller.update_course(course_id, title, description, level, duration)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.delete("/courses/{course_id}")
async def delete_course(course_id: int):
    try:
        response = course_controller.delete_course(course_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

# Department management endpoints
@router.post("/departments")
async def create_department(name: str, description: str):
    try:
        response = department_controller.create_department(name, description)
        return JSONResponse(content=response, status_code=201)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.get("/departments")
async def get_departments():
    try:
        response = department_controller.get_all_departments()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.put("/departments/{dept_id}")
async def update_department(dept_id: int, name: str, description: str):
    try:
        response = department_controller.update_department(dept_id, name, description)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.delete("/departments/{dept_id}")
async def delete_department(dept_id: int):
    try:
        response = department_controller.delete_department(dept_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.departement_models import DepartmentInCreate, DepartmentInUpdate
from controllers.department_controller import create_department,get_all_departments,update_department,delete_department,get_departments_names_ids




router = APIRouter()


@router.post("/createDepartment")
async def create_department_route():
    try:
        response = create_department("Untitled Department", "No Description")
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
    
@router.put("updateDepartment")
async def update_department_route(data : DepartmentInUpdate):
    try:
        response = update_department(data.id, data.name, data.description)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)


@router.delete("/deleteDepartment/{dept_id}")
async def delete_department_route(dept_id: int):
    try:
        response = delete_department(dept_id)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    

@router.get("/getDepartments")
async def get_departments():
    try:
        response = get_all_departments()
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
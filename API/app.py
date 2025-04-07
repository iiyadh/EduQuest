import datetime
from http.client import HTTPException
import random
import string
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
from pymongo import *
from passlib.context import CryptContext
from bson import ObjectId
from fastapi import Response
from fastapi.responses import JSONResponse
from fastapi import Request
import jwt


app = FastAPI()

# CORS Configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200","http://localhost:3000"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://tabaiiyadh317:sG93hRye4btB058t@cluster0.cxp3v.mongodb.net/?tls=true")
db = client.StudentMS
student_collection = db.get_collection("students")
formations_collection = db.get_collection("formations")
departments_collection = db.get_collection("departments")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


## JWT Configurations 
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def generateCode():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


## ---------------------------------------------------------------------------- Student Routes For Registration and Login ---------------------------------------------------------------------------- ##
## Registration
@app.post("/student/register")
async def register(student: dict):
    email = student["email"]
    if await student_collection.find_one({"email": email}):
        return JSONResponse(content={"message": "Email already exists"},status_code=400)
    student["password"] = pwd_context.hash(student["password"])
    student["formation"] = []
    student["departmentId"] = ObjectId(student["departmentId"])
    user = await student_collection.insert_one(student)
    return {"user": str(user.inserted_id), "message": "Registration successful"}


## Login
@app.post("/student/login")
async def login(student: dict, response: Response):
    email = student["email"]
    s = await student_collection.find_one({'email': email})
    if s and pwd_context.verify(student["password"], s["password"]):
        token = jwt.encode({"sub": str(s["_id"]), "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}, SECRET_KEY, algorithm=ALGORITHM)
        response.set_cookie(key="token", value=token, httponly=True)
        return {"user": str(s["_id"]), "message": "Login successful","token":token}
    return JSONResponse(content={"message": "Invalid email or password"}, status_code=401)



## Check Authentication
@app.get("/student/check")
async def check(req : Request):
    token = req.cookies.get("token")
    if not token:
        return {"message": "Token not found"}
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        user = await student_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"message": "User not found"}
        return {"message": "User authenticated"}
    except jwt.ExpiredSignatureError:
        return JSONResponse(content={"message": "Token expired"}, status_code=401)
    except jwt.InvalidTokenError:
        return JSONResponse(content={"message": "Invalid token"}, status_code=401)


## Logout 
@app.post("/student/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logout successful"}


## ---------------------------------------------------------------------------- Student Formations ---------------------------------------------------------------------------- ##
@app.get("/student/formations")
async def get_formations(req: Request, uid: str):
    if not req.cookies.get("token"):
        return {"message": "Token not found"}
    student = await student_collection.find_one({"_id": ObjectId(uid)})
    if not student:
        return {"message": "Student not found"}
    formations = []
    for formation_id in student.get("formation", []):
        formation = await formations_collection.find_one({"_id": ObjectId(formation_id)})
        if formation:
            formation["_id"] = str(formation["_id"])
            formations.append(formation)
    return formations

@app.post("/student/enrollformation/{codeformation}")
async def add_formation(codeformation: str, data: dict):
    formation = await formations_collection.find_one_and_update({"codeformation": codeformation}, {"$push": {"students": ObjectId(data["user_id"])}}, return_document=True)
    if formation:
        user = await student_collection.find_one_and_update({"_id": ObjectId(data["user_id"])}, {"$push": {"formation": formation["_id"]}}, return_document=True)
        if user:
            return {"message": "Formation added successfully" , "formation" : formation}
    return {"message": "Failed"}

@app.delete("/student/quitformation")
async def remove_formation(data : dict):
    user = await student_collection.find_one_and_update({"_id": ObjectId(data["user_id"])},{"$pull": {"formation": ObjectId(data["formation_id"])}},return_document=True)
    formation = await formations_collection.find_one_and_update({"_id": ObjectId(data["formation_id"])},{"$pull": {"students": ObjectId(data["user_id"])}},return_document=True)
    if user and formation:
        return {"message": "Formation removed successfully"}
    return {"message": "Failed"}



### ---------------------------------------------------------------------------- Student Departments ---------------------------------------------------------------------------- ##
@app.get("/student/departments")
async def get_departments():
    departments = await departments_collection.find().to_list(length=100)
    result = []
    for department in departments:
        result.append({"_id":str(department["_id"]),"name":department["name"]})
    return result

## ---------------------------------------------------------------------------- Admin ---------------------------------------------------------------------------- ##
## Authentication Admin
@app.post("/admin/authentication")
async def authenticate_admin(admin: dict, response: Response):
    user = admin["user"]
    password = admin["password"]
    if user != "admin" or password != "admin":
        return JSONResponse(content={"message": "Invalid username or password"}, status_code=401)
    token = jwt.encode(
        {"sub": "sudo", "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    # response.set_cookie(
    #     key="token",
    #     value=token,
    #     httponly=True,
    #     secure=False,
    #     samesite="lax",
    #     # domain="localhost",  # Explicitly set domain
    #     path="/",
    #     max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    # )
    return JSONResponse(content={"message": "Admin authenticated" , "token": token}, status_code=200)

@app.get("/admin/check")
async def check_auth(token: str):
    if not token:
        return JSONResponse(content={"message": "Token not found"}, status_code=401)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        code = payload["sub"]
        if code != "sudo":
            return JSONResponse(content={"message": "Admin not authenticated","isLoggedIn" : False}, status_code=403)
        return {"message": "Admin authenticated","isLoggedIn" : True}
    except jwt.ExpiredSignatureError:
        return JSONResponse(content={"message": "Token expired" ,"isLoggedIn" : False}, status_code=401)
    except jwt.InvalidTokenError:
        return JSONResponse(content={"message": "Invalid token" ,"isLoggedIn" : False}, status_code=401)

@app.post("/admin/logout")
async def logout_admin():
    return {"message": "Logout successful"}


## Manage Formations 
@app.get("/admin/formations")
async def get_formations():
    formations = await formations_collection.find().to_list()
    for formation in formations:
        formation["_id"] = str(formation["_id"])
    return formations

@app.post("/admin/addformation")
async def add_formation(formation: dict):
    formation["students"] = []
    formation["codeformation"] = generateCode()
    newformation = await formations_collection.insert_one(formation)
    created_formation = await formations_collection.find_one({"_id": newformation.inserted_id})
    if created_formation:
        created_formation["_id"] = str(created_formation["_id"])
    return {"message": "Formation added successfully", "formation": created_formation}

@app.put("/admin/updateformation/{formation_id}")
async def update_formation(formation_id: str, formation: dict):
    updated_formation = await formations_collection.find_one_and_update({"_id": ObjectId(formation_id)}, {"$set": formation}, return_document=True)
    if updated_formation:
        return {"message": "Formation updated successfully"}
    return {"message": "Formation not found"}

@app.delete("/admin/deleteformation/{formation_id}")
async def delete_formation(formation_id: str):
    deleted_formation = await formations_collection.find_one_and_delete({"_id": ObjectId(formation_id)})
    if deleted_formation:
        return {"message": "Formation deleted successfully"}
    return {"message": "Formation not found"}


## Manage Students
@app.get("/admin/allstudents")
async def allstudents():
    try:
        students = await student_collection.find().to_list(length=100)
        for student in students:
            if "departmentId" in student:
                department = await departments_collection.find_one({"_id": student["departmentId"]})
                student["department"] = department["name"] if department else None
                del student["departmentId"]
            if "formation" in student:
                formation_names = []
                for formation_id in student["formation"]:
                    formation = await formations_collection.find_one({"_id": formation_id})
                    if formation:
                        formation_names.append(formation["name"])
                student["formations"] = formation_names
                del student["formation"]
        for student in students:
            student["_id"] = str(student["_id"])
            del student["password"]
        print(students)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# @app.put("admin/changestudentstate/{student_id}")
# async def changestudentstate(student_id: str, state: str):
#     updated_student = await student_collection.find_one_and_update({"_id": ObjectId(student_id)}, {"$set": {"isActive": state == "active"}}, return_document=True)
#     if updated_student:
#         return {"message": "Student state updated successfully"}
#     return {"message": "Student not found"}

@app.delete("/admin/deletestudent/{student_id}")
async def deletestudent(student_id: str):
    deleted_student = await student_collection.find_one_and_delete({"_id": ObjectId(student_id)})
    if deleted_student:
        return {"message": "Student deleted successfully"}
    return {"message": "Student not found"}


## Manage Departments
@app.get("/admin/alldepartement")
async def alldepartments():
    departments = await departments_collection.find().to_list(length=100)  # Specify a reasonable length
    for department in departments:
        department["_id"] = str(department["_id"])
    return departments

@app.post("/admin/adddepartment")
async def add_department(department: dict):
    newdepartment = await departments_collection.insert_one(department)
    return {"message": "Department added successfully", "department": str(newdepartment.inserted_id)}


@app.put("/admin/updatedepartment/{department_id}")
async def update_department(department_id: str, department: dict):
    try:
        department_object_id = ObjectId(department_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid department ID format")
    

    department.pop('_id', None)
    
    updated_department = await departments_collection.find_one_and_update(
        {"_id": department_object_id},
        {"$set": department},
        return_document=ReturnDocument.AFTER
    )
    
    if not updated_department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    updated_department['_id'] = str(updated_department['_id'])
    return updated_department

@app.delete("/admin/deletedepartment/{department_id}")
async def delete_department(department_id: str):
    deleted_department = await departments_collection.find_one_and_delete({"_id": ObjectId(department_id)})
    if deleted_department:
        return {"message": "Department deleted successfully"}
    return {"message": "Department not found"}
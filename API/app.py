import datetime
from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
from passlib.context import CryptContext
from bson import ObjectId
from fastapi.responses import JSONResponse
import jwt
import random
import string
from pymongo import ReturnDocument

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://tabaiiyadh317:sG93hRye4btB058t@cluster0.cxp3v.mongodb.net/?tls=true")
db = client.StudentMS
student_collection = db.get_collection("students")
formations_collection = db.get_collection("formations")
departments_collection = db.get_collection("departments")
reports_collection = db.get_collection("reports")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def generateCode():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


@app.post("/student/register")
async def register(student: dict):
    email = student["email"]
    if await student_collection.find_one({"email": email}):
        return JSONResponse(content={"message": "Email already exists"}, status_code=400)
    student["password"] = pwd_context.hash(student["password"])
    student["formation"] = []
    student["departmentId"] = ObjectId(student["departmentId"])
    user = await student_collection.insert_one(student)
    return {"user": str(user.inserted_id), "message": "Registration successful"}


@app.post("/student/login")
async def login(student: dict):
    if not all(k in student for k in ["email", "password"]):
        return JSONResponse(content={"message": "Missing email or password"}, status_code=400)

    s = await student_collection.find_one({'email': student["email"]})
    if s and pwd_context.verify(student["password"], s["password"]):
        token = jwt.encode(
            {
                "sub": str(s["_id"]),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            },
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        return {
            "user": {"id": str(s["_id"]), "departmentId": str(s["departmentId"])},
            "message": "Login successful",
            "token": token
        }
    return JSONResponse(content={"message": "Invalid email or password"}, status_code=401)


@app.get("/student/check/{token}")
async def check(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = await student_collection.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            return {"message": "User not found"}
        return {"message": "User authenticated", "user": {"_id": str(user["_id"]), "departmentId": str(user["departmentId"])}}
    except jwt.ExpiredSignatureError:
        return JSONResponse(content={"message": "Token expired"}, status_code=401)
    except jwt.InvalidTokenError:
        return JSONResponse(content={"message": "Invalid token"}, status_code=401)


@app.post("/student/logout")
async def logout():
    return {"message": "Logout successful"}


@app.get("/student/{uid}")
async def fetch_user_data(uid: str):
    user = await student_collection.find_one({"_id": ObjectId(uid)})
    if not user:
        return JSONResponse(content={"message": "User not found"}, status_code=404)
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    user.pop("formation", None)
    user.pop("departmentId", None)
    user.pop("email", None)
    return user


@app.get("/student/ownformations/{uid}")
async def get_formations(uid: str):
    student = await student_collection.find_one({"_id": ObjectId(uid)})
    if not student:
        return {"message": "Student not found"}
    formations = []
    for fid in student.get("formation", []):
        formation = await formations_collection.find_one({"_id": ObjectId(fid)})
        if formation:
            formation["_id"] = str(formation["_id"])
            del formation["students"]
            formations.append(formation)
    return formations


@app.get("/student/formations/{departmentId}")
async def get_formations_by_theme(departmentId: str):
    dep = await departments_collection.find_one({"_id": ObjectId(departmentId)})
    if not dep:
        return []
    formations = await formations_collection.find({"theme": dep["theme"]}).to_list(length=100)
    for f in formations:
        f["_id"] = str(f["_id"])
        del f["students"]
    return formations


@app.post("/student/enrollformation/{codeformation}")
async def add_formation(codeformation: str, data: dict):
    if data["data"] == "code":
        formation = await formations_collection.find_one({"codeformation": codeformation})
        if not formation:
            return {"message": "Formation not found"}
        data["_id"] = str(formation["_id"])
    formation = await formations_collection.find_one_and_update(
        {"codeformation": codeformation},
        {"$push": {"students": ObjectId(data["user_id"])}},
        return_document=ReturnDocument.AFTER
    )
    if formation:
        user = await student_collection.find_one_and_update(
            {"_id": ObjectId(data["user_id"])},
            {"$push": {"formation": formation["_id"]}},
            return_document=ReturnDocument.AFTER
        )
        del formation["students"]
        if user:
            return {"message": "Formation added successfully", "formation": formation}
    return {"message": "Failed"}


@app.delete("/student/quitformation")
async def remove_formation(data: dict):
    user = await student_collection.find_one_and_update(
        {"_id": ObjectId(data["user_id"])},
        {"$pull": {"formation": ObjectId(data["formation_id"])}},
    )
    formation = await formations_collection.find_one_and_update(
        {"_id": ObjectId(data["formation_id"])},
        {"$pull": {"students": ObjectId(data["user_id"])}},
    )
    del formation["students"]
    if user and formation:
        return {"message": "Formation removed successfully", "formation": formation}
    return {"message": "Failed"}

@app.post("/adminreport")
async def add_report(report: dict):
    await reports_collection.insert_one(report)
    return { "message": "Report added successfully"}

@app.get("/admin/reports")
async def get_reports():
    reports = await reports_collection.find().to_list(length=100)
    for report in reports:
        report["id"] = str(report["_id"])
        report.pop("_id", None)
    return reports


@app.delete("/admin/deletereport/{report_id}")
async def delete_report(report_id: str):
    deleted = await reports_collection.find_one_and_delete({"_id": ObjectId(report_id)})
    if deleted:
        return {"message": "Report deleted successfully"}
    return {"message": "Report not found"}

@app.post("/admin/authentication")
async def authenticate_admin(admin: dict, response: Response):
    if admin.get("user") != "admin" or admin.get("password") != "admin":
        return JSONResponse(content={"message": "Invalid username or password"}, status_code=401)
    token = jwt.encode(
        {"sub": "sudo", "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return JSONResponse(content={"message": "Admin authenticated", "token": token}, status_code=200)


@app.get("/admin/check")
async def check_auth(token: str):
    if not token:
        return JSONResponse(content={"message": "Token not found"}, status_code=401)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload["sub"] != "sudo":
            return JSONResponse(content={"message": "Admin not authenticated", "isLoggedIn": False}, status_code=403)
        return {"message": "Admin authenticated", "isLoggedIn": True}
    except jwt.ExpiredSignatureError:
        return JSONResponse(content={"message": "Token expired", "isLoggedIn": False}, status_code=401)
    except jwt.InvalidTokenError:
        return JSONResponse(content={"message": "Invalid token", "isLoggedIn": False}, status_code=401)


@app.post("/admin/logout")
async def logout_admin():
    return {"message": "Logout successful"}


@app.get("/admin/formations")
async def get_formations():
    formations = await formations_collection.find().to_list(length=100)
    for formation in formations:
        formation["_id"] = str(formation["_id"])
        string_students = []
        for student in formation["students"]:
            stud = await student_collection.find_one({"_id": student})
            if stud:
                string_students.append(stud["username"])
        formation["students"] = string_students
    print(formations)
    return formations


@app.post("/admin/addformation")
async def add_formation(formation: dict):
    formation["students"] = []
    formation["codeformation"] = generateCode()
    newformation = await formations_collection.insert_one(formation)
    created = await formations_collection.find_one({"_id": newformation.inserted_id})
    if created:
        created["_id"] = str(created["_id"])
    return {"message": "Formation added successfully", "formation": created}


@app.put("/admin/updateformation/{formation_id}")
async def update_formation(formation_id: str, formation: dict):
    updated = await formations_collection.find_one_and_update(
        {"_id": ObjectId(formation_id)},
        {"$set": formation},
        return_document=ReturnDocument.AFTER
    )
    if updated:
        return {"message": "Formation updated successfully"}
    return {"message": "Formation not found"}


@app.delete("/admin/deleteformation/{formation_id}")
async def delete_formation(formation_id: str):
    deleted = await formations_collection.find_one_and_delete({"_id": ObjectId(formation_id)})
    if deleted:
        return {"message": "Formation deleted successfully"}
    return {"message": "Formation not found"}


@app.get("/admin/allstudents")
async def allstudents():
    students = await student_collection.find().to_list(length=100)
    for student in students:
        if "departmentId" in student:
            department = await departments_collection.find_one({"_id": student["departmentId"]})
            student["department"] = department["name"] if department else None
            student.pop("departmentId", None)
        if "formation" in student:
            formation_names = []
            for fid in student["formation"]:
                f = await formations_collection.find_one({"_id": fid})
                if f:
                    formation_names.append(f["title"])
            student["formations"] = formation_names
            student.pop("formation", None)
        student["_id"] = str(student["_id"])
        student.pop("password", None)
    return students


@app.delete("/admin/deletestudent/{student_id}")
async def deletestudent(student_id: str):
    deleted = await student_collection.find_one_and_delete({"_id": ObjectId(student_id)})
    if deleted:
        return {"message": "Student deleted successfully"}
    return {"message": "Student not found"}


@app.get("/admin/alldepartement")
async def alldepartments():
    departments = await departments_collection.find().to_list(length=100)
    for d in departments:
        d["_id"] = str(d["_id"])
    return departments

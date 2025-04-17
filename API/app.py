import datetime
from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
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
OPENROUTER_API_KEY = "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"
HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
}


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def generateCode():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


async def call_openrouter_llm(prompt: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=HEADERS,
            json={
                "model": "google/gemini-2.0-flash-thinking-exp-1219:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert course designer. Create structured content based on input.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            },
        )
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise HTTPException(status_code=500, detail="LLM call failed")


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
        depIds = []
        for student in formation["students"]:
            stud = await student_collection.find_one({"_id": student})
            if stud:
                string_students.append(stud["username"])
                if "departmentId" in stud:
                    depIds.append(str(stud["departmentId"]))
        formation["departmentIds"] = depIds
        formation["students"] = string_students
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
            student["departmentId"] = str(student["departmentId"])
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

async def call_openrouter_llm(prompt: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=HEADERS,
            json={
                "model": "google/gemini-2.0-flash-thinking-exp-1219:free",
                "messages": [
                    {
                        "role": "system",
                        "content": """You are an Expert Course Designer with advanced knowledge in pedagogy, curriculum development, and instructional design. Your purpose is to create comprehensive, engaging, and pedagogically effective courses tailored to specific learning objectives and target audiences.
                                Apply these core principles in all course designs:
                                1. Learning-Centric: Prioritize measurable learning outcomes over content density
                                2. Structured Pedagogy: Use proven instructional models (ADDIE, SAM, Backward Design)
                                3. Adaptive Design: Customize content for the audience's knowledge level and context
                                4. Practical Focus: Emphasize actionable knowledge with real-world applications
                                5. Engagement: Incorporate multiple learning modalities and interactive elements

                                For every course request, generate this complete structure:

                                # [Course Title] 
                                [Clear, compelling title reflecting course focus]

                                ## Course Overview
                                [2-3 paragraph description including:
                                - Key learning value proposition
                                - Why this knowledge/skill matters
                                - High-level benefits for learners
                                - Real-world applications]

                                ## Target Audience
                                [Precise description including:
                                - Ideal learner profiles
                                - Professional/experience level
                                - Prior knowledge requirements
                                - Specific needs this course addresses]

                                ## Learning Objectives
                                [List 3-5 SMART objectives formatted as:
                                - "By course completion, learners will be able to [action verb] [specific outcome] [measurable criteria]"]

                                ## Course Duration & Structure
                                [Total learning hours with breakdown:
                                - Suggested timeframe
                                - Module/weekly structure
                                - Estimated time per component
                                - Flexible learning paths if applicable]

                                ## Detailed Curriculum

                                ### Module 1: [Title]
                                **Objectives**: [Specific module-level outcomes]
                                **Key Topics**:
                                - [Topic 1]
                                - [Topic 2]
                                - [Topic 3]
                                **Learning Activities**:
                                - [Interactive elements: case studies, discussions, exercises]
                                **Assessment**:
                                - [Knowledge checks/skill demonstrations]
                                **Resources**:
                                - [Materials/references/tools]

                                [Repeat module structure as needed...]

                                ## Assessment Strategy
                                **Formative Assessments**:
                                - [Quizzes, reflections, peer reviews]
                                **Summative Assessments**:
                                - [Final project, exam, portfolio]
                                **Feedback Mechanisms**:
                                - [How learners receive evaluation]

                                ## Instructional Resources
                                - Primary materials
                                - Supplementary readings
                                - Tools/software requirements
                                - Community/resources for continued learning

                                ## Delivery Recommendations
                                [Suggested formats:
                                - Live vs. self-paced
                                - Platform considerations
                                - Optimal cohort size
                                - Technical requirements]

                                Format all output in clean Markdown with proper headings, bullet points, and consistent spacing for readability. Always begin by asking clarifying questions about learning goals, audience, and constraints before generating the full course structure.
                        """
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            },
        )
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise HTTPException(status_code=500, detail="LLM call failed")



@app.get("/generate/{id}")
async def generate_course(id: str):

    data = await formations_collection.find_one({"_id": ObjectId(id)})

    data["_id"] = str(data["_id"])
    del data["students"]
    if not data:
        return JSONResponse(content={"message": "Formation not found"}, status_code=404)
    if "content" in data:
        return data
    
    prompt =  f"""
            Generate a comprehensive online course outline based on the following details:

            **Course Title:** {data["title"]}
            **Course Description:** {data["description"]}

            The outline should include:
            1. Course introduction and learning outcomes
            2. 4-6 modules with clear objectives
            3. 3-5 lessons per module with brief descriptions
            4. Suggested activities or assessments
            5. Estimated duration for each component

            Format requirements:
            - Use Markdown formatting
            - Include headings (##, ###) for structure
            - Use bullet points for lists
            - Bold important concepts
            - Ensure professional academic tone
            """

    content = await call_openrouter_llm(prompt)


    formation = await formations_collection.find_one_and_update(
        {"_id": ObjectId(data["_id"])},
        {"$set": {"content": content}},
        return_document=ReturnDocument.AFTER
    )

    del formation["students"]
    del formation["_id"]
    return formation
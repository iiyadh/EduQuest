from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import async_session # type: ignore
from app.models.student import Student # type: ignore
from sqlalchemy.future import select
from passlib.context import CryptContext

router = APIRouter(prefix="/student")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_session():
    async with async_session() as session:
        yield session

@router.post("/register")
async def register_student(student: dict, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Student).where(Student.email == student["email"]))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(student["password"])
    new_student = Student(
        username=student["username"],
        email=student["email"],
        password=hashed_password,
        department_id=student["departmentId"]
    )
    session.add(new_student)
    await session.commit()
    await session.refresh(new_student)
    return {"user": new_student.id, "message": "Registration successful"}
@router.post("/login")
def login(student: StudentLogin, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.email == student.email).first()
    if not db_student or not pwd_context.verify(student.password, db_student.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({
        "sub": str(db_student.id),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "user": {"id": db_student.id, "departmentId": db_student.department_id},
        "message": "Login successful",
        "token": token
    }


@router.get("/check/{token}")
def check(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
        user = db.query(Student).filter(Student.id == user_id).first()
        if not user:
            return {"message": "User not found"}
        return {"message": "User authenticated", "user": {"_id": user.id, "departmentId": user.department_id}}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/logout")
def logout():
    return {"message": "Logout successful"}


@router.get("/{uid}")
def fetch_user_data(uid: int, db: Session = Depends(get_db)):
    user = db.query(Student).filter(Student.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id}


@router.get("/ownformations/{uid}")
def get_formations(uid: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == uid).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return [{"id": f.id, "codeformation": f.codeformation, "theme": f.theme} for f in student.formations]


@router.get("/formations/{departmentId}")
def get_formations_by_theme(departmentId: int, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.id == departmentId).first()
    if not department:
        return []
    formations = db.query(Formation).filter(Formation.theme == department.theme).all()
    return [{"id": f.id, "codeformation": f.codeformation, "theme": f.theme} for f in formations]


@router.post("/enrollformation/{codeformation}")
def add_formation(codeformation: str, data: dict, db: Session = Depends(get_db)):
    formation = db.query(Formation).filter(Formation.codeformation == codeformation).first()
    if not formation:
        raise HTTPException(status_code=404, detail="Formation not found")
    student = db.query(Student).filter(Student.id == data["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.formations.append(formation)
    db.commit()
    return {"message": "Formation added successfully", "formation": {"id": formation.id, "codeformation": formation.codeformation}}


@router.delete("/quitformation")
def remove_formation(data: dict, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == data["user_id"]).first()
    formation = db.query(Formation).filter(Formation.id == data["formation_id"]).first()
    if student and formation and formation in student.formations:
        student.formations.remove(formation)
        db.commit()
        return {"message": "Formation removed successfully", "formation": {"id": formation.id, "codeformation": formation.codeformation}}
    return {"message": "Failed"}
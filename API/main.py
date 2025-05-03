from fastapi import FastAPI
from app.routers import student

app = FastAPI()

app.include_router(student.router, prefix="/student", tags=["Students"])

@app.get("/")
def root():
    return {"message": "API is running"}

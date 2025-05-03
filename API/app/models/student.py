from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    department = relationship("Department", back_populates="students")
    formations = relationship("Formation", secondary="student_formations", back_populates="students")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    theme = Column(String)

    students = relationship("Student", back_populates="department")

class Formation(Base):
    __tablename__ = "formations"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    codeformation = Column(String, unique=True)
    theme = Column(String)

    students = relationship("Student", secondary="student_formations", back_populates="formations")

# Association table
student_formations = Table(
    "student_formations", Base.metadata,
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("formation_id", ForeignKey("formations.id"), primary_key=True),
)

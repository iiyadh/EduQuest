from pydantic import BaseModel, Field
from typing import List


class Lesson(BaseModel):
    id: str
    title: str
    content: str


class Module(BaseModel):
    id: str
    title: str
    lessons: List[Lesson] = Field(default_factory=list)


class Course(BaseModel):
    id: str
    title: str
    description: str
    level: str
    duration: str
    modules: List[Module] = Field(default_factory=list)

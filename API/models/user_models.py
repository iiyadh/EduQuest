from pydantic import BaseModel

class UserInLogin(BaseModel):
    email: str
    password: str

class UserInRegister(BaseModel):
    username: str
    email: str
    password: str
    departmentId: int

class UserOut(BaseModel):
    id: int
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int

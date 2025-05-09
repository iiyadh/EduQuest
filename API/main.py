from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes,admin_routes
import lib.db as db

app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db.create_tables_if_not_exist()

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])





from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_users_table
import auth, captioning

app = FastAPI()
create_users_table()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(captioning.router)

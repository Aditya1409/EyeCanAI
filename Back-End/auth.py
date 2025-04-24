from fastapi import APIRouter, HTTPException, Form
from database import get_db
import hashlib
from jose import jwt
import time

router = APIRouter()

SECRET_KEY = "your-secret-key"  
ALGORITHM = "HS256"

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(username: str):
    payload = {
        "sub": username,
        "exp": time.time() + 3600  
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                       (username, hash_password(password)))
        conn.commit()
    except:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()
    
    token = "dummy_token_for_now"  # Replace with real token logic if needed
    return {"message": "Account created successfully", "token": token}


@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
    stored_password = cursor.fetchone()
    conn.close()
    if stored_password and stored_password[0] == hash_password(password):
        token = create_token(username)
        return {"token": token}
    
    raise HTTPException(status_code=401, detail="Invalid username or password")


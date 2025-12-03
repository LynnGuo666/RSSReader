from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import secrets
from .config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash using SHA256 with salt"""
    try:
        salt, hash_value = hashed_password.split(':')
        password_hash = hashlib.sha256((salt + plain_password).encode()).hexdigest()
        return password_hash == hash_value
    except:
        return False


def get_password_hash(password: str) -> str:
    """Hash a password using SHA256 with random salt"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}:{password_hash}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

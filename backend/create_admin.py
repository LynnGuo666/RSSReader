#!/usr/bin/env python3
"""
Script to create an admin user for the RSS Reader application.
Usage: python create_admin.py
"""

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User


def create_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("❌ Admin user already exists!")
            print(f"   Username: {existing_admin.username}")
            print(f"   Email: {existing_admin.email}")
            return

        # Create admin user
        password = "admin123"
        # Ensure password is within bcrypt's 72 byte limit
        if len(password.encode('utf-8')) > 72:
            password = password[:72]

        admin = User(
            username="admin",
            email="admin@admin.com",
            hashed_password=get_password_hash(password)
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("✅ Admin user created successfully!")
        print(f"   Username: admin")
        print(f"   Email: admin@admin.com")
        print(f"   Password: admin123")
        print("\n⚠️  Please change the password after first login!")

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()

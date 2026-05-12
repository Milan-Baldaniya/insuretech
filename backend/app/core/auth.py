from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import get_settings

settings = get_settings()
security = HTTPBearer()

def _configured_values(raw: str) -> set[str]:
    return {value.strip().lower() for value in (raw or "").split(",") if value.strip()}


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the Supabase JWT and returns the Supabase user object.
    """
    token = credentials.credentials
    try:
        from app.core.db import get_db
        supabase = get_db()
        
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
            )
        return user_response.user
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(user = Depends(get_current_user)) -> str:
    """Return the authenticated Supabase user id."""
    return user.id


def get_current_admin_user(user = Depends(get_current_user)):
    """
    Require an admin account.

    Admins can be configured in Supabase user app_metadata:
    - {"role": "admin"}
    - {"is_admin": true}

    Or through comma-separated env vars:
    - ADMIN_EMAILS=admin@example.com,owner@example.com
    - ADMIN_USER_IDS=<supabase-user-id>
    """
    app_metadata = getattr(user, "app_metadata", None) or {}
    role = str(app_metadata.get("role", "")).lower()
    is_metadata_admin = role == "admin" or app_metadata.get("is_admin") is True

    email = str(getattr(user, "email", "") or "").lower()
    user_id = str(getattr(user, "id", "") or "").lower()
    is_configured_admin = (
        email in _configured_values(settings.admin_emails)
        or user_id in _configured_values(settings.admin_user_ids)
    )

    if not (is_metadata_admin or is_configured_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access is required.",
        )

    return user

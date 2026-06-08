from fastapi import APIRouter
from backend import services
from fastapi import File, UploadFile

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File()):
    return services.upload_document(file=file)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.database import engine, Base
from .core.scheduler import start_scheduler, stop_scheduler
from .api.endpoints import auth, feeds, articles


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="RSS Reader API",
    description="A modern RSS reader with FastAPI backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(feeds.router, prefix="/api/feeds", tags=["feeds"])
app.include_router(articles.router, prefix="/api/articles", tags=["articles"])


@app.get("/")
def root():
    return {"message": "RSS Reader API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

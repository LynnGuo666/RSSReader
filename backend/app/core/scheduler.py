from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from .config import settings
from ..services.rss_fetcher import fetch_all_feeds

scheduler = AsyncIOScheduler()


def start_scheduler():
    scheduler.add_job(
        fetch_all_feeds,
        trigger=IntervalTrigger(minutes=settings.RSS_FETCH_INTERVAL_MINUTES),
        id='fetch_rss_feeds',
        name='Fetch all RSS feeds',
        replace_existing=True
    )
    scheduler.start()
    print(f"Scheduler started. RSS feeds will be fetched every {settings.RSS_FETCH_INTERVAL_MINUTES} minutes.")


def stop_scheduler():
    scheduler.shutdown()

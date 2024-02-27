from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from models import QueuedPost, Watch
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import UUID, insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import and_, or_


def create_queued_post(session, post: QueuedPost):
    try:
        session.add(post)
        session.commit()
        session.refresh(post)
        return post
    except IntegrityError:
        session.rollback()
        return None


def get_queued_posts(session, limit: int):
    return (
        session.query(QueuedPost)
        .filter(QueuedPost.processed == False)
        .limit(limit)
        .all()
    )


def mark_post_as_processed(session, post_id: str):
    post = session.query(QueuedPost).filter(QueuedPost.post_id == post_id).first()
    if post:
        post.processed = True
        session.commit()
        return True
    return False


def delete_processed_posts(session):
    session.query(QueuedPost).filter(QueuedPost.processed == True).delete()
    session.commit()


def create_watch(session, watch: Watch):
    session.add(watch)
    session.commit()
    session.refresh(watch)
    return watch


def get_watches_by_brand_model(session, brand: str, ref: str):
    return (
        session.query(Watch)
        .filter(and_(Watch.Brand == brand, Watch.Reference_Number == ref))
        .all()
    )

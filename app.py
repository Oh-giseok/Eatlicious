from __future__ import annotations

import base64
import json
import os
import sqlite3
import urllib.error
import urllib.request
from contextlib import contextmanager
from datetime import date, timedelta
from pathlib import Path
from typing import Iterator

from flask import Flask, jsonify, request, send_from_directory


ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "fridge.db"
app = Flask(__name__, static_folder="static", static_url_path="") 
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def connect_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


@contextmanager
def db_session() -> Iterator[sqlite3.Connection]:
    connection = connect_db()
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_db() -> None:
    with db_session() as db:
        table_existed = db.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'ingredients'"
        ).fetchone() is not None
        db.execute(
            """CREATE TABLE IF NOT EXISTS ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity TEXT NOT NULL DEFAULT '1개',
                purchased_at TEXT NOT NULL,
                expires_at TEXT NOT NULL
            )"""
        )
        # Seed only on the first database creation. An intentionally emptied fridge
        # must stay empty after the server restarts.
        if not table_existed:
            today = date.today()
            starter_items = [
                ("두부", "1모", today - timedelta(days=1), today + timedelta(days=2)),
                ("대파", "1단", today - timedelta(days=4), today + timedelta(days=1)),
                ("달걀", "6개", today - timedelta(days=2), today + timedelta(days=12)),
                ("양파", "2개", today - timedelta(days=6), today + timedelta(days=7)),
                ("당근", "1개", today - timedelta(days=3), today + timedelta(days=5)),
            ]
            db.executemany(
                "INSERT INTO ingredients (name, quantity, purchased_at, expires_at) VALUES (?, ?, ?, ?)",
                [(name, quantity, bought.isoformat(), expires.isoformat()) for name, quantity, bought, expires in starter_items],
            )


initialize_db()


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/ingredients")
def list_ingredients():
    with db_session() as db:
        rows = db.execute(
            "SELECT id, name, quantity, purchased_at, expires_at FROM ingredients ORDER BY expires_at, id"
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/recognize-ingredients")
def recognize_ingredients():
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        return jsonify(error="AI 인식 기능을 사용하려면 OPENAI_API_KEY를 먼저 설정해야 해요."), 503

    image = request.files.get("image")
    if not image or not image.filename:
        return jsonify(error="냉장고 사진을 선택해 주세요."), 400
    mime_type = image.mimetype.lower()
    if mime_type not in ALLOWED_IMAGE_TYPES:
        return jsonify(error="JPG, PNG, WEBP, GIF 사진만 인식할 수 있어요."), 400

    image_bytes = image.read(app.config["MAX_CONTENT_LENGTH"] + 1)
    if not image_bytes:
        return jsonify(error="선택한 사진이 비어 있어요."), 400
    if len(image_bytes) > app.config["MAX_CONTENT_LENGTH"]:
        return jsonify(error="사진은 8MB 이하로 선택해 주세요."), 413

    image_data = base64.b64encode(image_bytes).decode("ascii")
    payload = {
        "model": os.environ.get("OPENAI_VISION_MODEL", "gpt-5.5"),
        "store": False,
        "input": [{
            "role": "user",
            "content": [
                {"type": "input_text", "text": (
                    "냉장고 선반을 위에서 아래로 빠짐없이 살펴 사진에 실제 보이는 "
                    "모든 먹거리와 마실 것을 한국어로 식별하세요. 채소, 과일, 달걀, "
                    "유제품, 통조림, 포장 식품뿐 아니라 콜라·주스·생수 등 음료도 "
                    "포함하세요. 브랜드명은 적지 말고 일반적인 식품 이름만 사용하세요. "
                    "콜라 브랜드나 종류 표시 없이 이름은 항상 '콜라'로 적으세요. "
                    "개수는 세거나 추정하지 마세요. 같은 종류의 식품이나 "
                    "음료가 여러 개 보여도 이름을 한 번만 반환하세요. 예를 들어 콜라가 "
                    "여러 개면 '콜라' 한 항목만 적으세요. 같은 종류는 하나로 합치세요. "
                    "용기나 포장에 가려 종류를 확신할 수 없는 것은 추측하지 마세요. "
                    "최대 40종류까지 반환하고, 보이는 "
                    '항목이 없을 때만 빈 배열을 반환하세요. JSON 객체 하나만 사용하세요. '
                    '형식: {"ingredients":["대파","달걀","콜라"]}.'
                )},
                {"type": "input_image", "detail": "auto", "image_url": f"data:{mime_type};base64,{image_data}"},
            ],
        }],
    }
    api_request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(api_request, timeout=90) as response:
            result = json.loads(response.read().decode("utf-8"))
        output_text = result.get("output_text")
        if not output_text:
            output_text = "".join(
                block.get("text", "")
                for item in result.get("output", [])
                for block in item.get("content", [])
                if block.get("type") == "output_text"
            )
        parsed = json.loads(output_text)
        names = parsed.get("ingredients") if isinstance(parsed, dict) else None
        if not isinstance(names, list):
            return jsonify(error="사진 인식 결과를 읽지 못했어요. 다른 사진으로 다시 시도해 주세요."), 502
        names = list(dict.fromkeys(
            str(name).strip()[:40] for name in names
            if isinstance(name, str) and str(name).strip()
        ))[:20]
        return jsonify(ingredients=names)
    except urllib.error.HTTPError as error:
        try:
            api_error = json.loads(error.read().decode("utf-8")).get("error", {})
        except (json.JSONDecodeError, UnicodeDecodeError, AttributeError):
            api_error = {}
        error_code = str(api_error.get("code", ""))
        error_type = str(api_error.get("type", ""))
        if error.code in {401, 403}:
            return jsonify(error="API 키를 확인해 주세요. OpenAI API 키가 유효하지 않아요."), 502
        if error.code == 429:
            if error_code in {"rate_limit_exceeded", "requests", "tokens"}:
                return jsonify(error="요청이 잠시 몰려 사진 인식 한도에 걸렸어요. 잠시 기다렸다가 다시 시도해 주세요."), 429
            if error_code in {"credit_balance_exhausted", "insufficient_quota", "organization_usage_limit_exceeded", "organization_spend_limit_exceeded", "project_spend_limit_exceeded"} or error_type == "insufficient_quota":
                return jsonify(error="OpenAI API 크레딧이나 지출 한도에 도달했어요. API 플랫폼의 Billing과 Eatlicious 프로젝트 Limits를 확인해 주세요."), 429
            return jsonify(error="OpenAI API에서 요청 한도 오류를 반환했어요. API 플랫폼의 Billing, 프로젝트 Limits, 사용량을 확인해 주세요."), 429
        return jsonify(error="AI 사진 인식 요청에 실패했어요. 잠시 후 다시 시도해 주세요."), 502
    except (urllib.error.URLError, TimeoutError):
        return jsonify(error="AI 서비스에 연결하지 못했어요. 인터넷 연결을 확인해 주세요."), 502
    except (json.JSONDecodeError, KeyError, TypeError):
        return jsonify(error="사진 인식 결과를 읽지 못했어요. 다른 사진으로 다시 시도해 주세요."), 502


@app.errorhandler(413)
def upload_too_large(_error):
    return jsonify(error="사진은 8MB 이하로 선택해 주세요."), 413


@app.post("/api/ingredients")
def create_ingredient():
    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict):
        return jsonify(error="식재료 정보를 확인해 주세요."), 400
    name = str(payload.get("name", "")).strip()
    quantity = str(payload.get("quantity", "1개")).strip() or "1개"
    if len(name) > 40 or len(quantity) > 24:
        return jsonify(error="이름은 40자, 수량은 24자 이내로 입력해 주세요."), 400
    try:
        purchased_at = date.fromisoformat(str(payload.get("purchased_at", "")))
        expires_at = date.fromisoformat(str(payload.get("expires_at", "")))
    except ValueError:
        return jsonify(error="구매일과 소비 권장일을 확인해 주세요."), 400
    if not name:
        return jsonify(error="식재료 이름을 입력해 주세요."), 400
    if expires_at < purchased_at:
        return jsonify(error="소비 권장일은 구매일보다 빠를 수 없어요."), 400

    with db_session() as db:
        cursor = db.execute(
            "INSERT INTO ingredients (name, quantity, purchased_at, expires_at) VALUES (?, ?, ?, ?)",
            (name, quantity, purchased_at.isoformat(), expires_at.isoformat()),
        )
        row = db.execute(
            "SELECT id, name, quantity, purchased_at, expires_at FROM ingredients WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return jsonify(dict(row)), 201


@app.post("/api/ingredients/bulk")
def create_ingredients_bulk():
    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict):
        return jsonify(error="등록할 재료를 확인해 주세요."), 400
    items = payload.get("ingredients", [])
    if not isinstance(items, list) or not items or len(items) > 20:
        return jsonify(error="등록할 재료를 확인해 주세요."), 400
    prepared = []
    try:
        for item in items:
            name = str(item.get("name", "")).strip()[:40]
            purchased_at = date.fromisoformat(str(item.get("purchased_at", "")))
            expires_at = date.fromisoformat(str(item.get("expires_at", "")))
            if not name:
                return jsonify(error="재료 이름을 입력해 주세요."), 400
            if expires_at < purchased_at:
                return jsonify(error="소비 권장일은 구매일보다 빠를 수 없어요."), 400
            quantity = str(item.get("quantity", "")).strip()[:24]
            prepared.append((name, quantity, purchased_at.isoformat(), expires_at.isoformat()))
    except (AttributeError, ValueError, TypeError):
        return jsonify(error="구매일과 소비 권장일을 확인해 주세요."), 400

    with db_session() as db:
        ids = []
        for item in prepared:
            cursor = db.execute(
                "INSERT INTO ingredients (name, quantity, purchased_at, expires_at) VALUES (?, ?, ?, ?)", item
            )
            ids.append(cursor.lastrowid)
        placeholders = ",".join("?" for _ in ids)
        rows = db.execute(
            f"SELECT id, name, quantity, purchased_at, expires_at FROM ingredients WHERE id IN ({placeholders}) ORDER BY id",
            tuple(ids),
        ).fetchall()
    return jsonify([dict(row) for row in rows]), 201


@app.put("/api/ingredients/<int:ingredient_id>")
def update_ingredient(ingredient_id: int):
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="식재료 정보를 확인해 주세요."), 400
    name = str(payload.get("name", "")).strip()
    quantity = str(payload.get("quantity", "")).strip()
    if not name or len(name) > 40 or len(quantity) > 24:
        return jsonify(error="이름은 필수이며 40자, 수량은 24자 이내로 입력해 주세요."), 400
    try:
        purchased_at = date.fromisoformat(str(payload.get("purchased_at", "")))
        expires_at = date.fromisoformat(str(payload.get("expires_at", "")))
    except ValueError:
        return jsonify(error="구매일과 소비 권장일을 확인해 주세요."), 400
    if expires_at < purchased_at:
        return jsonify(error="소비 권장일은 구매일보다 빠를 수 없어요."), 400
    with db_session() as db:
        db.execute(
            "UPDATE ingredients SET name = ?, quantity = ?, purchased_at = ?, expires_at = ? WHERE id = ?",
            (name, quantity, purchased_at.isoformat(), expires_at.isoformat(), ingredient_id),
        )
        row = db.execute(
            "SELECT id, name, quantity, purchased_at, expires_at FROM ingredients WHERE id = ?",
            (ingredient_id,),
        ).fetchone()
    if row is None:
        return jsonify(error="식재료를 찾을 수 없어요."), 404
    return jsonify(dict(row))


@app.delete("/api/ingredients")
def remove_ingredient():
    ingredient_id = request.args.get("id", "")
    if not ingredient_id.isdigit():
        return jsonify(error="식재료 번호가 올바르지 않아요."), 400
    with db_session() as db:
        db.execute("DELETE FROM ingredients WHERE id = ?", (int(ingredient_id),))
    return jsonify(ok=True)


if __name__ == "__main__":
    app.run(debug=True)

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import Dict, List, Optional, Union


router = APIRouter()

# 데이터베이스 파일의 경로
DBPATH = "정호연.db"


# 테이블 스키마를 정의하는 모델
class TableSchema(BaseModel):
    cid: int
    name: str
    type: str
    notnull: int
    dflt_value: Optional[Union[str, int]] = None
    pk: int

# 테이블 데이터를 정의하는 모델
class TableData(BaseModel):
    schema: List[TableSchema]
    data: List[List[Union[str, int, float, None]]]

class SaveResponse(BaseModel):
    backup_data: Dict[str, TableData]

class LoadRequest(BaseModel):
    tables: Dict[str, TableData]

@router.post("/save")
async def save():
    try:
        # SQLite3 데이터베이스 연결
        conn = sqlite3.connect(DBPATH)
        cursor = conn.cursor()
        backup = {}

        # 모든 테이블 이름 가져오기
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        for table in tables:
            table_name = table[0]
            
            # 테이블 스키마 가져오기
            cursor.execute(f"PRAGMA table_info({table_name});")
            schema = cursor.fetchall()
            schema_list = [TableSchema(cid=row[0], name=row[1], type=row[2], notnull=row[3], dflt_value=row[4], pk=row[5]) for row in schema]
            
            # 테이블 데이터 가져오기
            cursor.execute(f"SELECT * FROM {table_name};")
            rows = cursor.fetchall()

            # 테이블 스키마와 데이터 백업
            backup[table_name] = {
                'schema': schema_list,
                'data': rows
            }

        conn.close()
        return SaveResponse(backup_data=backup)

    except sqlite3.DatabaseError as e:
        raise HTTPException(status_code=500, detail=f"Database operation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.post("/load")
async def load(request: LoadRequest):
    try:
        # SQLite3 데이터베이스 연결
        conn = sqlite3.connect(DBPATH)
        cursor = conn.cursor()

        # 기존 데이터베이스 테이블 삭제
        cursor.execute("PRAGMA foreign_keys=off;")
        cursor.execute("BEGIN TRANSACTION;")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        for table in tables:
            cursor.execute(f"DROP TABLE IF EXISTS {table[0]};")

        # 새로운 데이터베이스 생성
        for table_name, table_data in request.tables.items():
            # 테이블 생성 쿼리 작성
            columns = [f"{col.name} {col.type}" for col in table_data.schema]
            create_table_query = f"CREATE TABLE {table_name} ({', '.join(columns)});"
            cursor.execute(create_table_query)

            # 데이터 삽입
            placeholders = ', '.join(['?'] * len(table_data.schema))
            insert_query = f"INSERT INTO {table_name} VALUES ({placeholders});"
            cursor.executemany(insert_query, table_data.data)

        # 커밋 및 연결 종료
        conn.commit()
        conn.close()

        return {"success": True}

    except sqlite3.DatabaseError as e:
        raise HTTPException(status_code=500, detail=f"Database operation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Load failed: {str(e)}")

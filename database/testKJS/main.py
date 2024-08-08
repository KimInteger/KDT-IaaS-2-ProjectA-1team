from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RowDeleteRequest(BaseModel):
    row_id: int

class ColumnDeleteRequest(BaseModel):
    column_name: str

class ColumnAddRequest(BaseModel):
    column_name: str

class RowUpdateRequest(BaseModel):
    row_id: int
    updated_values: dict

class ColumnUpdateRequest(BaseModel):
    old_column_name: str
    new_column_name: str


def get_db_connection():
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    return conn

# 전체 테이블 정보 조회 현재 있는 table을 렌더링하기 위함
@app.get("/tables")
async def get_tables():
    conn = get_db_connection()
    cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row['name'] for row in cursor.fetchall()]
    conn.close()
    return {"tables": tables}

# 특정 테이블 내부의 데이터 조회
@app.get("/table/{table_name}")
async def get_table_data(table_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name});")
    schema = [row[1] for row in cursor.fetchall()]
    cursor.execute(f"SELECT rowid, * FROM {table_name};")
    rows = cursor.fetchall()
    conn.close()
    return {"schema": schema, "rows": [dict(zip(['rowid'] + schema, row)) for row in rows]}

# 행 삭제 처리
@app.post("/table/{table_name}/delete_row")
async def delete_row(table_name: str, request: RowDeleteRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM {table_name} WHERE rowid = ?", (request.row_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# 열 삭제 처리
@app.post("/table/{table_name}/delete_column")
async def delete_column(table_name: str, request: ColumnDeleteRequest):
    column_name = request.column_name
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if column exists
    cursor.execute(f"PRAGMA table_info({table_name});")
    schema = cursor.fetchall()
    columns = [col[1] for col in schema]  # Extract column names

    if column_name not in columns:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Column '{column_name}' not found")

    # Create a new table without the column to be deleted
    new_columns = [col for col in columns if col != column_name]
    new_columns_str = ", ".join(new_columns)
    
    # Start a transaction
    try:
        cursor.execute(f"BEGIN TRANSACTION;")

        # Create a new table without the column
        cursor.execute(f"CREATE TABLE temp AS SELECT {new_columns_str} FROM {table_name} WHERE 0;")
        
        # Insert data from the old table to the new table
        cursor.execute(f"INSERT INTO temp SELECT {new_columns_str} FROM {table_name};")
        
        # Drop the old table
        cursor.execute(f"DROP TABLE {table_name};")
        
        # Rename new table to the old table name
        cursor.execute(f"ALTER TABLE temp RENAME TO {table_name};")
        
        # Commit the transaction
        cursor.execute(f"COMMIT;")
    
    except Exception as e:
        # Rollback in case of error
        cursor.execute(f"ROLLBACK;")
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"status": "success"}

# 행추가 처리
@app.post("/table/{table_name}/add_row")
async def add_row(table_name: str, request: dict):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Extract the column names and values from the request
    columns = ', '.join(request.keys())
    placeholders = ', '.join(['?'] * len(request))
    values = list(request.values())

    # Insert the new row into the table
    try:
        cursor.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"status": "success"}

# 열추가 처리
@app.post("/table/{table_name}/add_column")
async def add_column(table_name: str, request: ColumnAddRequest):
    column_name = request.column_name
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Add a new column to the table
        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} TEXT")
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"status": "success"}


# 행 수정(update) 처리
@app.post("/table/{table_name}/update_row")
async def update_row(table_name: str, request: RowUpdateRequest):
    row_id = request.row_id
    updated_values = request.updated_values

    if not updated_values:
        raise HTTPException(status_code=400, detail="No values to update")

    set_clause = ", ".join([f"{key} = ?" for key in updated_values.keys()])
    values = list(updated_values.values()) + [row_id]

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"UPDATE {table_name} SET {set_clause} WHERE rowid = ?", values)
    conn.commit()
    conn.close()

    return {"status": "success"}

@app.post("/table/{table_name}/update_column")
async def update_column(table_name: str, request: ColumnUpdateRequest):
    old_column_name = request.old_column_name
    new_column_name = request.new_column_name

    conn = get_db_connection()
    
    try:
        conn.execute(f"PRAGMA foreign_keys=off;")
        
        # Create a new table with the updated column name
        columns = conn.execute(f"PRAGMA table_info({table_name})").fetchall()
        column_definitions = ", ".join(
            f"{col[1]} {col[2]}" if col[1] != old_column_name else f"{new_column_name} {col[2]}"
            for col in columns
        )
        
        conn.execute(f"CREATE TABLE new_table ({column_definitions});")
        conn.execute(f"INSERT INTO new_table SELECT * FROM {table_name};")
        conn.execute(f"DROP TABLE {table_name};")
        conn.execute(f"ALTER TABLE new_table RENAME TO {table_name};")
        
        conn.execute(f"PRAGMA foreign_keys=on;")
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Ensure the temporary table is dropped
        conn.execute(f"DROP TABLE IF EXISTS temp;")
        conn.close()
    
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3636)

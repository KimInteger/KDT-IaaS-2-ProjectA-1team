import sqlite3

def initialize_db():
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ABC (
            fruit TEXT,
            food TEXT,
            ice TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS EDF (
            price INTEGER,
            name TEXT,
            age INTEGER
        )
    ''')
    
    cursor.executemany('''
        INSERT INTO ABC (fruit, food, ice) VALUES (?, ?, ?)
    ''', [
        ('Apple', 'Bread', 'Vanilla'),
        ('Banana', 'Cake', 'Chocolate'),
        ('Orange', 'Pie', 'Strawberry')
    ])
    
    cursor.executemany('''
        INSERT INTO EDF (price, name, age) VALUES (?, ?, ?)
    ''', [
        (10, 'John Doe', 30),
        (20, 'Jane Doe', 25),
        (30, 'Jim Beam', 40)
    ])
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    initialize_db()

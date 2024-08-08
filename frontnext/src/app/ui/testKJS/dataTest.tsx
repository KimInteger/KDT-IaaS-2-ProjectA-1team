import { useState, useEffect } from 'react';

interface Column {
  name: string;
}

interface Row {
  [key: string]: any;
}

interface TableData {
  schema: Column[];
  rows: Row[];
}

const Home = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      const response = await fetch('http://localhost:3636/tables');
      const data = await response.json();
      setTables(data.tables);
    };
    fetchTables();
  }, []);

  const loadTableData = async (tableName: string) => {
    const response = await fetch(`http://localhost:3636/table/${tableName}`);
    const data = await response.json();
    setTableData(data);
    setSelectedTable(tableName);
  };

  const deleteRow = async (rowId: number) => {
    await fetch(`http://localhost:3636/table/${selectedTable}/delete_row`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row_id: rowId }),
    });
    loadTableData(selectedTable!);
  };

  const deleteColumn = async (columnName: string) => {
    await fetch(`http://localhost:3636/table/${selectedTable}/delete_column`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column_name: columnName }),
    });
    loadTableData(selectedTable!);
  };

  return (
    <div>
      <h1>Database Tables</h1>
      <ul>
        {tables.map((table) => (
          <li key={table}>
            <button onClick={() => loadTableData(table)}>{table}</button>
          </li>
        ))}
      </ul>

      {tableData && (
        <div>
          <h2>Table: {selectedTable}</h2>
          <table>
            <thead>
              <tr>
                {tableData.schema.map((column) => (
                  <th key={column.name}>{column.name}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, index) => (
                <tr key={index}>
                  {tableData.schema.map((column) => (
                    <td key={column.name}>{row[column.name]}</td>
                  ))}
                  <td>
                    <button onClick={() => deleteRow(row.rowid)}>
                      Delete Row
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => deleteColumn('columnName')}>
            Delete Column
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

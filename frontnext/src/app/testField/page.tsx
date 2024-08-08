'use client';

import React, { useState, useEffect } from 'react';

interface Row {
  rowid: number;
  [key: string]: any;
}

interface TableData {
  schema: string[];
  rows: Row[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3636';

const Home = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [newRow, setNewRow] = useState<{ [key: string]: any }>({});
  const [showAddRowForm, setShowAddRowForm] = useState<boolean>(false);
  const [newColumn, setNewColumn] = useState<string>('');
  const [showAddColumnForm, setShowAddColumnForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/tables`);
        if (!response.ok) {
          console.error('Failed to fetch tables:', response.statusText);
          return;
        }
        const data = await response.json();
        setTables(data.tables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  const loadTableData = async (tableName: string) => {
    try {
      const response = await fetch(`${API_URL}/table/${tableName}`);
      if (!response.ok) {
        console.error('Failed to fetch table data:', response.statusText);
        return;
      }
      const data = await response.json();
      setTableData(data);
      setSelectedTable(tableName);
      setShowAddRowForm(false); // Hide add row form when loading table data
      setShowAddColumnForm(false);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const deleteRow = async (rowId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/table/${selectedTable}/delete_row`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ row_id: rowId }),
        },
      );
      if (!response.ok) {
        console.error('Failed to delete row:', response.statusText);
        return;
      }
      loadTableData(selectedTable!);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const deleteColumn = async (columnName: string) => {
    try {
      const response = await fetch(
        `${API_URL}/table/${selectedTable}/delete_column`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ column_name: columnName }),
        },
      );
      if (!response.ok) {
        console.error('Failed to delete column:', response.statusText);
        return;
      }
      loadTableData(selectedTable!);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const handleAddRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewRow = async () => {
    if (!selectedTable || !tableData) return;

    try {
      const response = await fetch(
        `${API_URL}/table/${selectedTable}/add_row`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRow),
        },
      );
      if (!response.ok) {
        console.error('Failed to add row:', response.statusText);
        return;
      }
      setNewRow({});
      setShowAddRowForm(false);
      loadTableData(selectedTable);
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const handleShowAddRowForm = () => {
    if (tableData) {
      const initialRow = tableData.schema.reduce(
        (acc, column) => {
          acc[column] = '';
          return acc;
        },
        {} as { [key: string]: any },
      );
      setNewRow(initialRow);
      setShowAddRowForm(true);
    }
  };

  const handleAddColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumn(e.target.value);
  };

  const saveNewColumn = async () => {
    if (!selectedTable || !newColumn) return;

    try {
      const response = await fetch(
        `${API_URL}/table/${selectedTable}/add_column`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ column_name: newColumn }),
        },
      );
      if (!response.ok) {
        console.error('Failed to add column:', response.statusText);
        return;
      }
      setNewColumn('');
      setShowAddColumnForm(false);
      loadTableData(selectedTable);
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const handleShowAddColumnForm = () => {
    setShowAddColumnForm(true);
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
                  <th key={column}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row) => (
                <tr key={row.rowid}>
                  {tableData.schema.map((column) => (
                    <td key={column}>{row[column]}</td>
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
          {tableData.schema.map((column) => (
            <button key={column} onClick={() => deleteColumn(column)}>
              Delete Column {column}
            </button>
          ))}

          <button onClick={handleShowAddRowForm}>Add Row</button>

          {showAddRowForm && (
            <div>
              <h3>Add New Row</h3>
              <form>
                {tableData.schema.map((column) => (
                  <div key={column}>
                    <label>
                      {column}:
                      <input
                        type="text"
                        name={column}
                        value={newRow[column] || ''}
                        onChange={handleAddRowChange}
                      />
                    </label>
                  </div>
                ))}
                <button type="button" onClick={saveNewRow}>
                  Save
                </button>
              </form>
            </div>
          )}

          <button onClick={handleShowAddColumnForm}>Add Column</button>

          {showAddColumnForm && (
            <div>
              <h3>Add New Column</h3>
              <form>
                <label>
                  Column Name:
                  <input
                    type="text"
                    value={newColumn}
                    onChange={handleAddColumnChange}
                  />
                </label>
                <button type="button" onClick={saveNewColumn}>
                  Save
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

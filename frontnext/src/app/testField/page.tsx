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
  const [editingRow, setEditingRow] = useState<{ [key: string]: any } | null>(
    null,
  );
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // 최초 렌더링시 마운트
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

  // datatable reload
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
      setEditingRow(null); // Clear editing state
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // 행 삭제 함수
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

  // 열 삭제 함수
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

  // 행 추가 관련 함수
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

  // 열 추가 관련 함수
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

  // 행 수정 관련 함수
  const handleEditClick = (row: Row) => {
    setEditingRow({ ...row });
    setEditingRowId(row.rowid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingRow((prev) => ({ ...prev, [name]: value }));
  };

  const saveUpdatedRow = async () => {
    if (!selectedTable || !editingRow || editingRowId === null) return;

    try {
      const response = await fetch(
        `${API_URL}/table/${selectedTable}/update_row`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row_id: editingRowId,
            updated_values: editingRow,
          }),
        },
      );
      if (!response.ok) {
        console.error('Failed to update row:', response.statusText);
        return;
      }
      setEditingRow(null);
      setEditingRowId(null);
      loadTableData(selectedTable);
    } catch (error) {
      console.error('Error updating row:', error);
    }
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
                    <td key={column}>
                      {editingRowId === row.rowid ? (
                        <label>
                          {column}:
                          <input
                            type="text"
                            name={column}
                            value={editingRow ? editingRow[column] || '' : ''}
                            onChange={handleInputChange}
                          />
                        </label>
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                  <td>
                    {editingRowId === row.rowid ? (
                      <button onClick={saveUpdatedRow}>Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(row)}>Edit</button>
                    )}
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

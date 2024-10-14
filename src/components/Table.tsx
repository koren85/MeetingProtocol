import React, { useState } from 'react';
import { TableRow } from './TableRow';
import { Trash2, Merge } from 'lucide-react';

interface TableProps {
  regions: string[];
  executors: string[];
}

interface RowData {
  id: number;
  region: string;
  mergedRows?: number;
  [key: string]: any;
}

export const Table: React.FC<TableProps> = ({ regions, executors }) => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [nextId, setNextId] = useState(1);

  const addRow = () => {
    setRows([...rows, { id: nextId }]);
    setNextId(nextId + 1);
  };

  const updateRow = (id: number, data: any) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...data } : row));
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const deleteSelectedRows = () => {
    setRows(rows.filter((_, index) => !selectedRows.includes(index)));
    setSelectedRows([]);
  };

  const mergeRows = () => {
    if (selectedRows.length < 2) return;

    const sortedSelectedRows = [...selectedRows].sort((a, b) => a - b);
    const firstRowIndex = sortedSelectedRows[0];
    const mergedRow = {
      ...rows[firstRowIndex],
      mergedRows: sortedSelectedRows.length,
    };

    for (let i = 1; i < sortedSelectedRows.length; i++) {
      const rowIndex = sortedSelectedRows[i];
      mergedRow[`row${i}`] = rows[rowIndex];
    }

    const newRows = rows.filter((_, index) => !selectedRows.includes(index));
    newRows.splice(firstRowIndex, 0, mergedRow);

    setRows(newRows);
    setSelectedRows([]);
  };

  const splitRow = (index: number) => {
    const row = rows[index];
    if (!row.mergedRows || row.mergedRows <= 1) return;

    const newRows = [
      { ...row, mergedRows: undefined },
      ...Array.from({ length: row.mergedRows - 1 }, (_, i) => ({
        ...row[`row${i + 1}`],
        id: nextId + i,
      })),
    ];

    setRows([
      ...rows.slice(0, index),
      ...newRows,
      ...rows.slice(index + 1),
    ]);
    setNextId(nextId + row.mergedRows - 1);
  };

  return (
    <div className="table-container">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border w-10"></th>
            <th className="p-2 border">№ п\п</th>
            <th className="p-2 border">Регион</th>
            <th className="p-2 border tasks-column">Задачи</th>
            <th className="p-2 border">Исполнитель</th>
            <th className="p-2 border">Срок выполнения</th>
            <th className="p-2 border">Отметка о выполнении</th>
            <th className="p-2 border">Результат</th>
            <th className="p-2 border">Подпись</th>
            <th className="p-2 border">Комментарий</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              index={index}
              data={row}
              regions={regions}
              executors={executors}
              updateRow={updateRow}
              isSelected={selectedRows.includes(index)}
              toggleSelection={() => toggleRowSelection(index)}
              onSplit={() => splitRow(index)}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex flex-col sm:flex-row justify-between">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0"
          onClick={addRow}
        >
          Добавить строку
        </button>
        <div className="space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto"
            onClick={mergeRows}
            disabled={selectedRows.length < 2}
          >
            <Merge size={20} className="mr-2" />
            Объединить выбранные строки
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto"
            onClick={deleteSelectedRows}
            disabled={selectedRows.length === 0}
          >
            <Trash2 size={20} className="mr-2" />
            Удалить выбранные строки
          </button>
        </div>
      </div>
    </div>
  );
};
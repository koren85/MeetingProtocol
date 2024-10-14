import React from 'react';
import { Split } from 'lucide-react';

interface TableRowProps {
  index: number;
  data: any;
  regions: string[];
  executors: string[];
  updateRow: (id: number, data: any) => void;
  isSelected: boolean;
  toggleSelection: () => void;
  onSplit: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  index,
  data,
  regions,
  executors,
  updateRow,
  isSelected,
  toggleSelection,
  onSplit,
}) => {
  const handleChange = (field: string, value: string, rowIndex: number = 0) => {
    if (data.mergedRows && data.mergedRows > 1) {
      updateRow(data.id, { [`row${rowIndex}`]: { ...data[`row${rowIndex}`], [field]: value } });
    } else {
      updateRow(data.id, { [field]: value });
    }
  };

  const rowSpan = data.mergedRows || 1;

  const renderCommonFields = () => (
    <>
      <td className="p-2 border w-10" rowSpan={rowSpan}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={toggleSelection}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </td>
      <td className="p-2 border" rowSpan={rowSpan}>{index + 1}</td>
      <td className="p-2 border" rowSpan={rowSpan}>
        <select
          className="w-full"
          value={data.region || ''}
          onChange={(e) => handleChange('region', e.target.value)}
        >
          <option value="">Выберите регион</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </td>
    </>
  );

  const renderRowFields = (rowData: any, rowIndex: number) => (
    <>
      <td className="p-2 border tasks-column">
        <textarea
          className="w-full"
          value={rowData.tasks || ''}
          onChange={(e) => handleChange('tasks', e.target.value, rowIndex)}
        />
      </td>
      <td className="p-2 border">
        <select
          className="w-full"
          value={rowData.executor || ''}
          onChange={(e) => handleChange('executor', e.target.value, rowIndex)}
        >
          <option value="">Выберите исполнителя</option>
          {executors.map((executor) => (
            <option key={executor} value={executor}>
              {executor}
            </option>
          ))}
        </select>
      </td>
      <td className="p-2 border">
        <input
          type="date"
          className="w-full"
          value={rowData.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value, rowIndex)}
        />
      </td>
      <td className="p-2 border">
        <input
          type="text"
          className="w-full"
          value={rowData.completionStatus || ''}
          onChange={(e) => handleChange('completionStatus', e.target.value, rowIndex)}
        />
      </td>
      <td className="p-2 border">
        <input
          type="text"
          className="w-full"
          value={rowData.result || ''}
          onChange={(e) => handleChange('result', e.target.value, rowIndex)}
        />
      </td>
      <td className="p-2 border">
        <input
          type="text"
          className="w-full"
          value={rowData.signature || ''}
          onChange={(e) => handleChange('signature', e.target.value, rowIndex)}
        />
      </td>
      <td className="p-2 border">
        <textarea
          className="w-full"
          value={rowData.comment || ''}
          onChange={(e) => handleChange('comment', e.target.value, rowIndex)}
        />
      </td>
    </>
  );

  if (data.mergedRows && data.mergedRows > 1) {
    const rows = [];
    for (let i = 0; i < data.mergedRows; i++) {
      rows.push(
        <tr key={`${data.id}-${i}`} className={isSelected ? 'bg-blue-100' : ''}>
          {i === 0 && renderCommonFields()}
          {renderRowFields(data[`row${i}`] || data, i)}
          {i === 0 && (
            <td className="p-2 border" rowSpan={rowSpan}>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={onSplit}
              >
                <Split size={20} />
              </button>
            </td>
          )}
        </tr>
      );
    }
    return <>{rows}</>;
  }

  return (
    <tr className={isSelected ? 'bg-blue-100' : ''}>
      {renderCommonFields()}
      {renderRowFields(data, 0)}
      <td className="p-2 border">
        {/* Empty cell for non-merged rows */}
      </td>
    </tr>
  );
};
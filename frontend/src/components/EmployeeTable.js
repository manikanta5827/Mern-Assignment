import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

import '../styles/EmployeeTable.css';

const EmployeeTable = ({ data, onEdit, onDelete }) => {
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'rowNumber',
        cell: (info) => info.row.index + 1,
      },
      {
        header: 'Name',
        accessorKey: 'f_Name',
      },
      {
        header: 'Email',
        accessorKey: 'f_Email',
      },
      {
        header: 'Mobile No',
        accessorKey: 'f_Mobile',
      },
      {
        header: 'Designation',
        accessorKey: 'f_Designation',
      },
      {
        header: 'Gender',
        accessorKey: 'f_Gender',
      },
      {
        header: 'Course',
        accessorKey: 'f_Course',
        cell: ({ row }) => row.original.f_Course.join(', '),
      },
      {
        header: 'Image',
        accessorKey: 'f_Image',
        cell: ({ row }) => (
          <img
            src={`http://localhost:4000${row.original.f_Image}`}
            alt={row.original.f_Name}
            className="employee-image"
          />
        ),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => (
          <>
            <button onClick={() => onEdit(row.original)}>Edit</button>
            <button onClick={() => onDelete(row.original._id)}>Delete</button>
          </>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="table-container">
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="Search"
        className="search-input"
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === 'asc'
                        ? '⬆️'
                        : '⬇️'
                      : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTable;

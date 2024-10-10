import React from 'react';
import { useTable, useSortBy } from 'react-table';

const EmployeeTable = ({ data, onEdit, onDelete }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Mobile No', accessor: 'mobileNo' },
      { Header: 'Designation', accessor: 'designation' },
      { Header: 'Gender', accessor: 'gender' },
      { Header: 'Course', accessor: 'course' },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <button onClick={() => onEdit(row.original)}>Edit</button>
            <button onClick={() => onDelete(row.original._id)}>Delete</button>
          </>
        ),
      },
    ],
    [onEdit, onDelete] // Include dependencies here
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} scope="col" key={column.id}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default EmployeeTable;

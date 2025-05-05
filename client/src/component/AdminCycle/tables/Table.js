import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have this
import { cn } from '@/lib/utils'; // Assuming you have this
import {
    ArrowUpDown,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    MessageCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import './Table.css';
import {} from '../../Core/tableData';



// Import data (simulated)
// import tableData from './table-data-core'; // Would be: import tableData from './table-data-core.js';


const BistikTable = () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [allRowsSelected, setAllRowsSelected] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof typeof tableData[0] | null; direction: 'ascending' | 'descending' } | null>(null);
    const [showBulkActions, setShowBulkActions] = useState(false); // New state for bulk actions
    const [bulkAction, setBulkAction] = useState(''); // New state to hold the selected bulk action

    const handleRowSelect = (id: number) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };

    const handleSelectAll = () => {
        setAllRowsSelected((prev) => {
            const newState = !prev;
            if (newState) {
                setSelectedRows(tableData.map((item) => item.id));
            } else {
                setSelectedRows([]);
            }
            return newState;
        });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...tableData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tableData, sortConfig]);

    const requestSort = (key: keyof typeof tableData[0]) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof typeof tableData[0]) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown className="ml-1 w-4 h-4" />;
        }
        return sortConfig.direction === 'ascending'
            ? <ArrowUpDown className="ml-1 w-4 h-4 rotate-180" />
            : <ArrowUpDown className="ml-1 w-4 h-4" />;
    };

    const handleBulkActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBulkAction(event.target.value);
    };

    const applyBulkAction = () => {
        if (bulkAction && selectedRows.length > 0) {
            if (bulkAction === 'trash') {
                // In a real app, you'd dispatch an action to delete the selected posts
                console.log('Deleting posts:', selectedRows);
                // For demo, we just clear selected rows
                setSelectedRows([]);
                setAllRowsSelected(false);
                setShowBulkActions(false);
            } else {
                console.log(`Applying action "${bulkAction}" to posts:`, selectedRows);
            }
            setBulkAction('');
        }
    };

    const clearSelection = () => {
        setSelectedRows([]);
        setAllRowsSelected(false);
        setShowBulkActions(false);
        setBulkAction('');
    }

    return (
        <div className="bistik-table-container">
            <style>{styles}</style>
            <Table
                striped
                bordered
                hover
                className="bistik-table"
                responsive
            >
                <thead>
                    <tr>
                        <th className="select-column">
                            <div className="flex items-center">
                                <Checkbox
                                    checked={allRowsSelected}
                                    onCheckedChange={handleSelectAll}
                                    id="cb-select-all-1"
                                    aria-label="Select All"
                                />
                                <label
                                    htmlFor="cb-select-all-1"
                                    className="sr-only"
                                >
                                    Select All
                                </label>
                            </div>
                        </th>
                        <th
                            className="title-column"
                            onClick={() => requestSort('title')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex items-center">
                                <span>Title</span>
                                {getSortIcon('title')}
                            </div>
                        </th>
                        <th className="author-column">Author</th>
                        <th className="categories-column">Categories</th>
                        <th className="tags-column">Tags</th>
                        <th
                            className="comments-column"
                            onClick={() => requestSort('comments')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex items-center">
                                <span>Comments</span>
                                {getSortIcon('comments')}
                            </div>
                        </th>
                        <th
                            className="date-column"
                            onClick={() => requestSort('date')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex items-center">
                                <span>Date</span>
                                {getSortIcon('date')}
                            </div>
                        </th>
                        <th className="actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr
                            key={item.id}
                            className={selectedRows.includes(item.id) ? 'selected-row' : ''}
                        >
                            <td className="select-column">
                                <div className="flex items-center">
                                    <Checkbox
                                        checked={selectedRows.includes(item.id)}
                                        onCheckedChange={() => handleRowSelect(item.id)}
                                        id={`cb-select-${item.id}`}
                                        aria-label={`Select ${item.title}`}
                                    />
                                    <label
                                        htmlFor={`cb-select-${item.id}`}
                                        className="sr-only"
                                    >
                                        Select {item.title}
                                    </label>
                                </div>
                            </td>
                            <td data-colname="Title" className="title-column">
                                <a
                                    href={`/wp-admin/post.php?post=${item.id}&action=edit`} // Replace with actual path
                                    aria-label={`Edit “${item.title}”`}
                                    className="post-title"
                                >
                                    {item.title}
                                </a>
                            </td>
                            <td data-colname="Author" className="author-column">
                                {item.author}
                            </td>
                            <td data-colname="Categories" className="categories-column">
                                {item.categories.join(', ')}
                            </td>
                            <td data-colname="Tags" className="tags-column">
                                {item.tags.join(', ')}
                            </td>
                            <td data-colname="Comments" className="comments-column">
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4 text-gray-500" />
                                    <span>{item.comments}</span>
                                </div>
                            </td>
                            <td data-colname="Date" className="date-column">
                                {item.date}
                            </td>
                            <td className="actions-column">
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/wp-admin/post.php?post=${item.id}&action=edit`} // Replace with actual path
                                        title="Edit"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`/wp-admin/post.php?post=${item.id}&action=trash&_wpnonce=...`} // Replace with actual path and nonce
                                        title="Trash"
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`/2024/03/05/${item.title.toLowerCase().replace(/ /g, '-')}/`} // Replace with actual path
                                        title="View"
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
                <div className="bulk-actions-container">
                    <div className="flex items-center gap-2">
                        <select
                            value={bulkAction}
                            onChange={handleBulkActionChange}
                            className="border rounded p-2"
                        >
                            <option value="">Bulk Actions</option>
                            <option value="edit">Edit</option>
                            <option value="trash">Move to Trash</option>
                            {/* Add more bulk actions as needed */}
                        </select>
                        <Button
                            variant="primary"
                            onClick={applyBulkAction}
                            disabled={!bulkAction}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Apply
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={clearSelection}
                            className="text-gray-700 hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm"
                        >
                            Clear selection
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected.
                    </p>
                </div>
            )}
        </div>
    );
};

export default BistikTable;


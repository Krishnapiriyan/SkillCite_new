import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ArrowUpDown } from 'lucide-react';

export default function DataTable({ 
  columns = [], 
  data = [], 
  searchPlaceholder = 'Search records...',
  searchField = 'name',
  detailRoutePrefix = '',
  filterField = '',
  filterOptions = [],
  filterPlaceholder = 'All',
  actionsRender = null,
  rowClassName = () => '',
  onRowClick = null
}) {
  const [filterText, setFilterText] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Local realtime search and dropdown filter
  const filteredData = data.filter((item) => {
    // 1. Dropdown filter check
    if (filterField && selectedFilter !== 'all') {
      const fieldVal = item[filterField];
      if (!fieldVal || fieldVal.toString().toLowerCase() !== selectedFilter.toLowerCase()) {
        return false;
      }
    }
    // 2. Search text check
    if (!filterText) return true;
    
    const searchLower = filterText.toLowerCase();
    
    if (searchColumn === 'all') {
      const searchableCols = columns.filter(col => col.searchable !== false && col.label !== 'Actions');
      return searchableCols.some(col => {
        const val = item[col.field];
        if (val === null || val === undefined) return false;
        
        let valStr = val.toString();
        if (typeof val === 'string' && val.includes('T') && val.endsWith('Z')) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
            valStr = `${valStr} ${dateStr}`;
          }
        }
        
        return valStr.toLowerCase().includes(searchLower);
      });
    } else {
      const val = item[searchColumn];
      if (val === null || val === undefined) return false;
      
      let valStr = val.toString();
      if (typeof val === 'string' && val.includes('T') && val.endsWith('Z')) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
          valStr = `${valStr} ${dateStr}`;
        }
      }
      
      return valStr.toLowerCase().includes(searchLower);
    }
  });

  // Local sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const comparison = aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: 'base' });
    return sortAsc ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
        {/* Realtime Search Bar with Column Selector */}
        <div className="flex w-full max-w-lg rounded-xl border border-border bg-surface focus-within:ring-4 focus-within:ring-accent-light focus-within:border-accent transition-all shadow-sm">
          <select 
            value={searchColumn}
            onChange={(e) => { setSearchColumn(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2.5 bg-slate-50 border-r border-border rounded-l-xl text-sm font-semibold text-primary outline-none cursor-pointer"
          >
            <option value="all">All Columns</option>
            {columns.filter(col => col.searchable !== false && col.label !== 'Actions').map(col => (
              <option key={col.field} value={col.field}>{col.label}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hint pointer-events-none" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => { setFilterText(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 rounded-r-xl bg-transparent text-sm text-primary placeholder-hint outline-none"
            />
          </div>
        </div>

        {/* Dropdown Filter */}
        {filterField && (
          <div className="w-full sm:w-auto min-w-[200px]">
            <select
              value={selectedFilter}
              onChange={(e) => { setSelectedFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-primary font-bold outline-none cursor-pointer focus:ring-4 focus:ring-accent-light focus:border-accent transition-all"
            >
              <option value="all">{filterPlaceholder || 'All'}</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Styled Grid Table Container */}
      <div className="w-full rounded-2xl border border-border bg-surface overflow-x-auto shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          
          <thead className="bg-bg-page border-b border-border text-[12.5px] font-extrabold text-primary uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.field} 
                  onClick={() => col.sortable && handleSort(col.field)}
                  className={`px-6 py-4.5 font-extrabold select-none
                    ${col.sortable ? 'cursor-pointer hover:bg-border/30' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="w-3.5 h-3.5 text-muted/60" />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4.5 w-12" />
            </tr>
          </thead>
 
          <tbody className="divide-y divide-border/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx}
                  onClick={() => {
                    if (onRowClick) onRowClick(row);
                    else if (detailRoutePrefix) navigate(`${detailRoutePrefix}/${row.id}`);
                  }}
                  className={`hover:bg-accent-light/10 transition-colors ${rowClassName(row)}
                    ${detailRoutePrefix || onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => {
                    const cellVal = row[col.field];
                    return (
                      <td key={col.field} className="px-6 py-5 font-semibold text-primary/95 text-sm max-w-xs truncate">
                        {col.render ? col.render(row) : (cellVal ?? '-')}
                      </td>
                    );
                  })}
                  <td className="px-6 py-5 text-muted flex items-center justify-end gap-3" onClick={(e) => actionsRender && e.stopPropagation()}>
                    {actionsRender && actionsRender(row)}
                    {(detailRoutePrefix || onRowClick) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRowClick) onRowClick(row);
                          else if (detailRoutePrefix) navigate(`${detailRoutePrefix}/${row.id}`);
                        }}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-muted font-medium bg-bg-page/40">
                  No records matching search parameters.
                </td>
              </tr>
            )}
          </tbody>

        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface border-t border-border">
            <span className="text-sm text-muted font-medium">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg shadow-sm disabled:opacity-50 hover:bg-slate-900 disabled:hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg shadow-sm disabled:opacity-50 hover:bg-slate-900 disabled:hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
      </div>

    </div>
  );
}

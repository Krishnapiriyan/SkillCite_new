import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ArrowUpDown } from 'lucide-react';

export default function DataTable({ 
  columns = [], 
  data = [], 
  searchPlaceholder = 'Search records...',
  searchField = 'name',
  detailRoutePrefix = ''
}) {
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Local realtime search filter
  const filteredData = data.filter((item) => {
    const val = item[searchField];
    if (!val) return false;
    return val.toString().toLowerCase().includes(filterText.toLowerCase());
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

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      
      {/* Realtime Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hint pointer-events-none" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-primary placeholder-hint outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
        />
      </div>

      {/* Styled Grid Table Container */}
      <div className="w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
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
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx}
                  onClick={() => detailRoutePrefix && navigate(`${detailRoutePrefix}/${row.id}`)}
                  className={`hover:bg-accent-light/10 transition-colors
                    ${detailRoutePrefix ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => {
                    const cellVal = row[col.field];
                    return (
                      <td key={col.field} className="px-6 py-5 font-semibold text-primary/95 text-sm max-w-xs truncate">
                        {col.render ? col.render(row) : (cellVal ?? '-')}
                      </td>
                    );
                  })}
                  <td className="px-6 py-5 text-muted flex items-center justify-end">
                    {detailRoutePrefix && <ChevronRight className="w-4 h-4 text-hint" />}
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
      </div>

    </div>
  );
}

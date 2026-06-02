import { useEffect, useState } from 'react';
import { getEmployersApi } from '../../services/api';

import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/ui/DataTable';

export default function EmployersIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await getEmployersApi();
        if (res.success && res.data) {
          setData(res.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  const columns = [
    { 
      label: 'Company Name', 
      field: 'companyName',
      sortable: true,
      render: (row) => <span className="font-bold text-primary">{row.companyName}</span>
    },
    { label: 'Contact Person', field: 'contactPerson', sortable: true },
    { label: 'Required Role', field: 'requiredRole', sortable: true },
    { 
      label: 'Division', 
      field: 'specialty', 
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold capitalize bg-blue-50 text-blue-600 border border-blue-100/70 shadow-sm">
          {row.specialty}
        </span>
      )
    },
    { 
      label: 'Date Received', 
      field: 'submittedAt', 
      sortable: true,
      render: (row) => {
        if (!row.submittedAt) return 'N/A';
        const d = new Date(row.submittedAt);
        if (isNaN(d.getTime())) return 'N/A';
        const dateStr = d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
        return (
          <div className="flex flex-col text-left">
            <span className="font-semibold text-primary">{dateStr}</span>
            <span className="text-[10px] text-muted font-medium mt-0.5">{timeStr}</span>
          </div>
        );
      }
    }
  ];

  return (
    <AdminLayout title="Employer Requests">
      <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col gap-6 shadow-sm">
        
        <div>
          <h2 className="text-base font-bold text-primary">Employers Intake Feed</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            View detailed recruitment demands, skill profiles, and supporting Specs/JD files uploaded by hiring companies.
          </p>
        </div>

        {loading ? (
          <div className="w-full h-40 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchField="companyName"
            searchPlaceholder="Search by company name..."
            detailRoutePrefix="/employers"
            filterField="specialty"
            filterPlaceholder="All Divisions"
            filterOptions={[
              { label: 'Engineering', value: 'engineering' },
              { label: 'Accounting', value: 'accounting' },
              { label: 'Administrative', value: 'administrative' },
              { label: 'Other', value: 'other' }
            ]}
          />
        )}

      </div>
    </AdminLayout>
  );
}

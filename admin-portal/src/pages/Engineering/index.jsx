import { useEffect, useState } from 'react';
import { getEngineeringRequestsApi } from '../../services/api';

import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/ui/DataTable';

export default function EngineeringIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getEngineeringRequestsApi();
        if (res.success && res.data) {
          setData(res.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const columns = [
    { 
      label: 'Client Name', 
      field: 'fullName',
      sortable: true,
      render: (row) => <span className="font-bold text-primary">{row.fullName}</span>
    },
    { 
      label: 'Service Type', 
      field: 'serviceType', 
      sortable: true,
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold capitalize bg-purple-50 text-purple-600 border border-purple-100/70 shadow-sm">
          {row.serviceType}
        </span>
      )
    },
    { label: 'Company', field: 'company', sortable: true },
    { 
      label: 'Delivery Deadline', 
      field: 'deadline', 
      sortable: true,
      render: (row) => {
        if (!row.deadline) return 'N/A';
        const d = new Date(row.deadline);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-AU');
      }
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
    <AdminLayout title="Engineering & Detailing Requests">
      <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col gap-6 shadow-sm">
        
        <div>
          <h2 className="text-base font-bold text-primary">Technical Specs Intake Feed</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Manage expert AutoCAD drafting, materials take-offs, Structural calculation proposals, and stamped code checks.
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
            searchField="fullName"
            searchPlaceholder="Search client full name..."
            detailRoutePrefix="/engineering"
          />
        )}

      </div>
    </AdminLayout>
  );
}

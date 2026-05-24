import { useEffect, useState } from 'react';
import { getCandidatesApi } from '../../services/api';

import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/ui/DataTable';

export default function CandidatesIndex() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await getCandidatesApi();
        if (res.success && res.data) {
          setData(res.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const columns = [
    { 
      label: 'Candidate Name', 
      field: 'firstName',
      sortable: true,
      render: (row) => <span className="font-bold text-primary">{row.firstName} {row.lastName}</span>
    },
    { label: 'Preferred Role', field: 'preferredRole', sortable: true },
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
      label: 'Exp', 
      field: 'yearsExperience', 
      sortable: true,
      render: (row) => `${row.yearsExperience} yrs`
    },
    { 
      label: 'Right to Work', 
      field: 'rightToWork', 
      sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-sm
          ${row.rightToWork === 'Citizen/PR' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100/70' 
            : 'bg-amber-50 text-amber-600 border-amber-100/70'}`}>
          {row.rightToWork}
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
    <AdminLayout title="Candidate Submissions">
      <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col gap-6 shadow-sm">
        
        <div>
          <h2 className="text-base font-bold text-primary">Candidates Intake Feed</h2>
          <p className="text-xs text-muted font-medium mt-0.5">
            Evaluate parsed candidate resumes, experience timelines, portfolio sites, and direct download resume documents.
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
            searchField="firstName"
            searchPlaceholder="Search candidate first name..."
            detailRoutePrefix="/candidates"
          />
        )}

      </div>
    </AdminLayout>
  );
}

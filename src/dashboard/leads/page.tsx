"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  source: string;
  status: string;
  budgetMin?: number;
  budgetMax?: number;
  assignedAgent?: { firstName: string; lastName: string };
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/leads", {
          params: { page, limit: 10, search, status, source },
        });
        setLeads(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
      } catch (error) {
        toast.error("Failed to fetch leads");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [search, status, source, page]);

  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: "badge-primary",
      CONTACTED: "badge-warning",
      INTERESTED: "badge-success",
      SITE_VISIT_SCHEDULED: "badge-warning",
      NEGOTIATING: "badge-warning",
      CLOSED_WON: "badge-success",
      CLOSED_LOST: "badge-danger",
      DEAD: "badge-danger",
    };
    return statusMap[status] || "badge-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-gray-600">Manage and track your leads</p>
        </div>
        <Link href="/dashboard/leads/new" className="btn-primary px-4 py-2">
          <Plus className="mr-2 h-4 w-4 inline" />
          Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-base w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="input-base w-full"
            >
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="INTERESTED">Interested</option>
              <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="input-base w-full"
            >
              <option value="">All Sources</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="WEBSITE">Website</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="REFERRAL">Referral</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="card">
        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex-center py-12 text-center">
            <div>
              <p className="text-gray-600">No leads found</p>
              <Link href="/dashboard/leads/new" className="mt-4 btn-primary inline-block px-4 py-2">
                Add your first lead
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Lead
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Budget
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>{lead.email}</div>
                      <div>{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {lead.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeColor(lead.status)}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {lead.budgetMin && lead.budgetMax ? (
                        <>
                          ₹{lead.budgetMin.toLocaleString("en-IN")} -{" "}
                          ₹{lead.budgetMax.toLocaleString("en-IN")}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div className="mt-4 flex-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / 10)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 10)}
              className="btn-secondary px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

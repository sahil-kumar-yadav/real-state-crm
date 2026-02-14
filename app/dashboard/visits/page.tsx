"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

interface PropertyVisit {
  id: string;
  status: string;
  scheduledAt: string;
  lead: { firstName: string; lastName: string; phone: string };
  property: { title: string; address: string };
  assignedAgent: { firstName: string; lastName: string };
  feedback?: string;
  rating?: number;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<PropertyVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/visits", {
          params: { page, limit: 10, status },
        });
        setVisits(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
      } catch (error) {
        toast.error("Failed to fetch visits");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [status, page]);

  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      SCHEDULED: "badge-warning",
      COMPLETED: "badge-success",
      NO_SHOW: "badge-danger",
      RESCHEDULED: "badge-warning",
      CANCELLED: "badge-danger",
    };
    return statusMap[status] || "badge-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Visits</h1>
          <p className="mt-1 text-gray-600">Schedule and manage property visits</p>
        </div>
        <Link href="/dashboard/visits/new" className="btn-primary px-4 py-2">
          <Plus className="mr-2 h-4 w-4 inline" />
          Schedule Visit
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits List */}
      <div className="card">
        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : visits.length === 0 ? (
          <div className="flex-center py-12 text-center">
            <div>
              <p className="text-gray-600">No visits scheduled</p>
              <Link href="/dashboard/visits/new" className="mt-4 btn-primary inline-block px-4 py-2">
                Schedule first visit
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {visit.property.title}
                    </h3>
                    <p className="text-sm text-gray-600">{visit.property.address}</p>
                  </div>
                  <span className={getStatusBadgeColor(visit.status)}>
                    {visit.status}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Lead</p>
                    <p className="font-medium text-gray-900">
                      {visit.lead.firstName} {visit.lead.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{visit.lead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Scheduled Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(visit.scheduledAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus as Plus } from "react-icons/fi";
import toast from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Commission {
  id: string;
  percentage: number;
  propertyPrice: number;
  commissionAmount: number;
  status: string;
  agent: { firstName: string; lastName: string };
  property: { title: string };
}

// Mock data
const MOCK_COMMISSIONS: Commission[] = [
  {
    id: "1",
    percentage: 5,
    propertyPrice: 500000,
    commissionAmount: 25000,
    status: "PENDING",
    agent: { firstName: "John", lastName: "Agent" },
    property: { title: "Luxury Villa in Downtown" },
  },
  {
    id: "2",
    percentage: 4,
    propertyPrice: 350000,
    commissionAmount: 14000,
    status: "PAID",
    agent: { firstName: "Sarah", lastName: "Contractor" },
    property: { title: "Modern Apartment Complex" },
  },
  {
    id: "3",
    percentage: 5,
    propertyPrice: 750000,
    commissionAmount: 37500,
    status: "PENDING",
    agent: { firstName: "John", lastName: "Agent" },
    property: { title: "Commercial Office Space" },
  },
  {
    id: "4",
    percentage: 3,
    propertyPrice: 200000,
    commissionAmount: 6000,
    status: "PAID",
    agent: { firstName: "Mike", lastName: "Developer" },
    property: { title: "Residential Plot" },
  },
];

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(MOCK_COMMISSIONS.length);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/commissions", {
          params: { page, limit: 10, status },
        });
        setCommissions(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
        setUseMockData(false);
      } catch (error) {
        console.warn("Database not available, using mock data");
        setUseMockData(true);
        const filtered = status
          ? MOCK_COMMISSIONS.filter((c) => c.status === status)
          : MOCK_COMMISSIONS;
        setCommissions(filtered);
        setTotal(filtered.length);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [status, page]);

  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "badge-warning",
      PAID: "badge-success",
      CANCELLED: "badge-danger",
      ON_HOLD: "badge-info",
    };
    return statusMap[status] || "badge-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
          <p className="mt-1 text-gray-600">Track and manage agent commissions</p>
        </div>
        <Link href="/dashboard/commissions/new" className="btn-primary px-4 py-2">
          <Plus className="mr-2 h-4 w-4 inline" />
          Add Commission
        </Link>
      </div>

      {/* Mock Data Warning */}
      {useMockData && (
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-800">ℹ️ Mock Data</p>
          <p className="text-xs text-blue-700 mt-1">
            Displaying sample commissions. Connect a database to see real data.
          </p>
        </div>
      )}

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
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="card">
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : commissions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No commissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900">Agent</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Property</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Percentage</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Commission</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {commission.agent.firstName} {commission.agent.lastName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {commission.property.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatCurrency(commission.propertyPrice)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {commission.percentage}%
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatCurrency(commission.commissionAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${getStatusBadgeColor(commission.status)}`}>
                        {commission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {commissions.length > 0 && (
        <div className="card flex-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600">
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
  );
}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Property {
  id: string;
  title: string;
  type: string;
  status: string;
  price: number;
  city: string;
  address: string;
  agent: { id: string; firstName: string; lastName: string };
  _count: { leads: number; propertyVisits: number };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/properties", {
          params: { page, limit: 10, search, status },
        });
        setProperties(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
      } catch (error) {
        toast.error("Failed to fetch properties");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, status, page]);

  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      AVAILABLE: "badge-success",
      SOLD: "badge-primary",
      RENTED: "badge-warning",
      UNDER_OFFER: "badge-danger",
      OFF_MARKET: "badge-primary",
    };
    return statusMap[status] || "badge-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-gray-600">Manage all your properties</p>
        </div>
        <Link href="/dashboard/properties/new" className="btn-primary px-4 py-2">
          <Plus className="mr-2 h-4 w-4 inline" />
          Add Property
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
              placeholder="Search by title, address..."
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
              <option value="AVAILABLE">Available</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="UNDER_OFFER">Under Offer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="card">
        {loading ? (
          <div className="flex-center py-8">
            <div className="spinner"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex-center py-12 text-center">
            <div>
              <p className="text-gray-600">No properties found</p>
              <Link href="/dashboard/properties/new" className="mt-4 btn-primary inline-block px-4 py-2">
                Add your first property
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Leads
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {property.city}, {property.address.substring(0, 30)}...
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ₹{property.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeColor(property.status)}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {property._count.leads}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
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

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus as Plus, FiSearch as Search, FiFilter as Filter } from "react-icons/fi";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";

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

// Mock data
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Luxury Villa in Downtown",
    type: "VILLA",
    status: "AVAILABLE",
    price: 500000,
    city: "New York",
    address: "123 Main St, Downtown",
    agent: { id: "1", firstName: "John", lastName: "Agent" },
    _count: { leads: 5, propertyVisits: 3 },
  },
  {
    id: "2",
    title: "Modern Apartment Complex",
    type: "APARTMENT",
    status: "RENTED",
    price: 350000,
    city: "Los Angeles",
    address: "456 Oak Ave, Midtown",
    agent: { id: "2", firstName: "Sarah", lastName: "Contractor" },
    _count: { leads: 2, propertyVisits: 1 },
  },
  {
    id: "3",
    title: "Commercial Office Space",
    type: "COMMERCIAL",
    status: "AVAILABLE",
    price: 750000,
    city: "Chicago",
    address: "789 Elm St, Business District",
    agent: { id: "1", firstName: "John", lastName: "Agent" },
    _count: { leads: 8, propertyVisits: 5 },
  },
  {
    id: "4",
    title: "Residential Plot",
    type: "LAND",
    status: "SOLD",
    price: 200000,
    city: "Denver",
    address: "321 Pine Rd, Suburb",
    agent: { id: "3", firstName: "Mike", lastName: "Developer" },
    _count: { leads: 1, propertyVisits: 0 },
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(MOCK_PROPERTIES.length);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/properties", {
          params: { page, limit: 10, search, status },
        });
        setProperties(response.data.data || []);
        setTotal(response.data.pagination?.total || 0);
        setUseMockData(false);
      } catch (error) {
        console.warn("Database not available, using mock data");
        setUseMockData(true);
        let filtered = MOCK_PROPERTIES;
        if (search) {
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.address.toLowerCase().includes(search.toLowerCase()) ||
              p.city.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (status) {
          filtered = filtered.filter((p) => p.status === status);
        }
        setProperties(filtered);
        setTotal(filtered.length);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">🏠 Properties</h1>
          <p className="mt-2 text-gray-600 text-lg font-medium">Manage all your real estate properties</p>
        </div>
        <Link href="/dashboard/properties/new" className="btn-primary px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="mr-2 h-5 w-5 inline" />
          Add Property
        </Link>
      </div>

      {/* Mock Data Warning */}
      {useMockData && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border border-blue-200/50 shadow-sm">
          <p className="text-sm font-bold text-blue-900">ℹ️ Mock Data</p>
          <p className="text-xs text-blue-700 mt-2">
            Displaying sample properties. Connect a database to see real data.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card-gradient border-0 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters & Search</h3>
        </div>
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
      <div className="card-gradient shadow-lg border-0">
        {loading ? (
          <div className="flex-center py-12">
            <div className="spinner"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex-center py-16 text-center">
            <div>
              <p className="text-gray-600 text-lg mb-4">📋 No properties found</p>
              <Link href="/dashboard/properties/new" className="btn-primary inline-block px-6 py-3 rounded-lg font-semibold">
                Add your first property
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gradient-to-r from-blue-200/50 to-indigo-200/50">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-gray-900">
                          {property.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">{property.type}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <span className="font-medium">{property.city}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{property.address.substring(0, 30)}...</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 text-base">
                      {formatCurrency(property.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${getStatusBadgeColor(property.status)} px-3 py-1.5 rounded-full text-xs font-bold`}>
                        {property.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        <span className="text-sm font-semibold text-gray-900">{property._count.leads}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
                        className="inline-block px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm transition-all"
                      >
                        View →
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
          <div className="mt-8 flex-center gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              ← Previous
            </button>
            <div className="px-4 py-2 rounded-lg bg-blue-50/50 text-sm font-bold text-gray-900">
              Page <span className="text-blue-600">{page}</span> of <span className="text-blue-600">{Math.ceil(total / 10)}</span>
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 10)}
              className="btn-secondary px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

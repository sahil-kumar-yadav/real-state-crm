"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "@/components/dashboard/StatCard";
import { FiBarChart2, FiUsers, FiHome, FiDollarSign } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
  totalProperties: number;
  availableProperties: number;
  activeLeads: number;
  closedLeads: number;
  totalVisits: number;
  completedVisits: number;
  pendingCommissions: number;
  paidCommissions: number;
}

const MOCK_ANALYTICS: AnalyticsData = {
  totalProperties: 127,
  availableProperties: 45,
  activeLeads: 89,
  closedLeads: 156,
  totalVisits: 203,
  completedVisits: 178,
  pendingCommissions: 850000,
  paidCommissions: 2140000,
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(MOCK_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/analytics/dashboard");
        setAnalytics(response.data.data);
        setUseMockData(false);
      } catch (error) {
        console.warn("Database not available, using mock data");
        setUseMockData(true);
        setAnalytics(MOCK_ANALYTICS);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your real estate business</p>
      </div>

      {/* Mock Data Warning */}
      {useMockData && (
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-semibold text-blue-800">ℹ️ Mock Data</p>
          <p className="text-xs text-blue-700 mt-1">
            Displaying sample analytics. Connect a database to see real data.
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={analytics.totalProperties}
          icon={<FiHome className="h-6 w-6" />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Leads"
          value={analytics.activeLeads}
          icon={<FiUsers className="h-6 w-6" />}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Completed Visits"
          value={analytics.completedVisits}
          icon={<FiBarChart2 className="h-6 w-6" />}
          color="purple"
          trend="+5%"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            analytics.paidCommissions + analytics.pendingCommissions
          )}
          icon={<FiDollarSign className="h-6 w-6" />}
          color="amber"
          trend="+23%"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Properties Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Properties</h2>
          <div className="space-y-4">
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Properties</span>
              <span className="font-semibold text-gray-900">
                {analytics.totalProperties}
              </span>
            </div>
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-gray-900">
                {analytics.availableProperties}
              </span>
            </div>
            <div className="flex-between py-3">
              <span className="text-gray-600">Listed</span>
              <span className="font-semibold text-gray-900">
                {analytics.totalProperties - analytics.availableProperties}
              </span>
            </div>
          </div>
        </div>

        {/* Leads Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Leads</h2>
          <div className="space-y-4">
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Active Leads</span>
              <span className="font-semibold text-gray-900">
                {analytics.activeLeads}
              </span>
            </div>
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Closed Deals</span>
              <span className="font-semibold text-gray-900">
                {analytics.closedLeads}
              </span>
            </div>
            <div className="flex-between py-3">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-gray-900">
                {(
                  (analytics.closedLeads /
                    (analytics.activeLeads + analytics.closedLeads)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Visits Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Property Visits</h2>
          <div className="space-y-4">
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Visits</span>
              <span className="font-semibold text-gray-900">
                {analytics.totalVisits}
              </span>
            </div>
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-gray-900">
                {analytics.completedVisits}
              </span>
            </div>
            <div className="flex-between py-3">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-gray-900">
                {((analytics.completedVisits / analytics.totalVisits) * 100).toFixed(
                  1
                )}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Commission Analytics */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Commissions</h2>
          <div className="space-y-4">
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(analytics.paidCommissions)}
              </span>
            </div>
            <div className="flex-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                {formatCurrency(analytics.pendingCommissions)}
              </span>
            </div>
            <div className="flex-between py-3">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(
                  analytics.paidCommissions + analytics.pendingCommissions
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

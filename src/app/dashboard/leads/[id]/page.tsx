"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft as ArrowLeft, FiEdit2 as Edit, FiTrash2 as Trash } from "react-icons/fi";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  source: string;
  status: string;
  notes?: string;
  budgetMin?: number;
  budgetMax?: number;
  interestedProperty?: {
    id: string;
    title: string;
    type: string;
    price: number;
  };
  assignedAgent?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const MOCK_LEADS: Record<string, Lead> = {
  "1": {
    id: "1",
    firstName: "John",
    lastName: "Anderson",
    email: "john.anderson@email.com",
    phone: "+1 (555) 123-4567",
    type: "RESIDENTIAL",
    source: "WEBSITE",
    status: "INTERESTED",
    notes: "Very interested in suburban properties with good schools.",
    budgetMin: 400000,
    budgetMax: 500000,
    interestedProperty: {
      id: "prop-1",
      title: "Modern Suburban Home",
      type: "RESIDENTIAL",
      price: 450000,
    },
    assignedAgent: { id: "agent-1", firstName: "Sarah", lastName: "Johnson" },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "2": {
    id: "2",
    firstName: "Emily",
    lastName: "Martinez",
    email: "emily.martinez@email.com",
    phone: "+1 (555) 234-5678",
    type: "COMMERCIAL",
    source: "REFERRAL",
    status: "CONTACTED",
    notes: "Looking for office space in downtown area.",
    budgetMin: 300000,
    budgetMax: 350000,
    assignedAgent: { id: "agent-2", firstName: "Michael", lastName: "Brown" },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "3": {
    id: "3",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 345-6789",
    type: "RESIDENTIAL",
    source: "FACEBOOK",
    status: "NEW",
    budgetMin: 500000,
    budgetMax: 650000,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/${leadId}`);
        if (response.ok) {
          const data = await response.json();
          setLead(data.data || null);
          setUseMockData(false);
        } else {
          // Fall back to mock data
          const mockLead = MOCK_LEADS[leadId];
          if (mockLead) {
            setLead(mockLead);
            setUseMockData(true);
          } else {
            toast.error("Lead not found");
            router.push("/dashboard/leads");
          }
        }
      } catch (error) {
        console.warn("Failed to fetch lead, using mock data:", error);
        const mockLead = MOCK_LEADS[leadId];
        if (mockLead) {
          setLead(mockLead);
          setUseMockData(true);
        } else {
          toast.error("Failed to load lead");
          router.push("/dashboard/leads");
        }
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchLead();
    }
  }, [leadId, router]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lead deleted successfully");
        router.push("/dashboard/leads");
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      toast.error("Error deleting lead");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/leads" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} />
          Back to Leads
        </Link>
        <div className="card flex-center min-h-[400px]">
          <p className="text-gray-500 text-lg">Lead not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <Link href="/dashboard/leads" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Leads
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {lead.firstName} {lead.lastName}
          </h1>
          {useMockData && (
            <p className="text-sm text-amber-600 mt-2">⚠️ Showing mock data (API unavailable)</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/leads/${lead.id}/edit`} className="btn-secondary px-4 py-2 flex items-center gap-2">
            <Edit size={18} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger px-4 py-2 flex items-center gap-2">
            <Trash size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Email</span>
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-700">
                  {lead.email}
                </a>
              </div>
              <div className="flex-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Phone</span>
                <a href={`tel:${lead.phone}`} className="text-gray-900 font-medium">
                  {lead.phone}
                </a>
              </div>
              <div className="flex-between py-3">
                <span className="text-gray-600">Type</span>
                <span className="badge-primary">{lead.type}</span>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h2>
            <div className="space-y-4">
              <div className="flex-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className={`badge-${getStatusColor(lead.status)}`}>{lead.status.replace(/_/g, " ")}</span>
              </div>
              <div className="flex-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Source</span>
                <span className="text-gray-900 font-medium">{lead.source}</span>
              </div>
              <div className="flex-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Budget</span>
                <span className="text-gray-900 font-medium">
                  {lead.budgetMin && lead.budgetMax
                    ? `₹${lead.budgetMin.toLocaleString("en-IN")} - ₹${lead.budgetMax.toLocaleString("en-IN")}`
                    : "Not specified"}
                </span>
              </div>
              <div className="flex-between py-3">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900 font-medium">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600 leading-relaxed">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Side Information */}
        <div className="space-y-6">
          {/* Assigned Agent */}
          {lead.assignedAgent && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Agent</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {lead.assignedAgent.firstName} {lead.assignedAgent.lastName}
                </p>
                <Link
                  href={`/dashboard/settings#agent-${lead.assignedAgent.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}

          {/* Interested Property */}
          {lead.interestedProperty && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interested Property</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{lead.interestedProperty.title}</p>
                <p className="text-sm text-gray-600">{lead.interestedProperty.type}</p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{lead.interestedProperty.price.toLocaleString("en-IN")}
                </p>
                <Link
                  href={`/dashboard/properties/${lead.interestedProperty.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 block mt-2"
                >
                  View Property
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    NEW: "primary",
    CONTACTED: "warning",
    INTERESTED: "success",
    SITE_VISIT_SCHEDULED: "warning",
    NEGOTIATING: "warning",
    CLOSED_WON: "success",
    CLOSED_LOST: "danger",
    DEAD: "danger",
  };
  return colorMap[status] || "primary";
}

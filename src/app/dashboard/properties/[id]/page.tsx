"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowLeft as ArrowLeft, FiEdit2 as Edit, FiTrash2 as Trash, FiMapPin as MapPin } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";

interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface PropertyVisit {
  id: string;
  scheduledAt: string;
  status: string;
  lead?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  originalPrice?: number;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  furnishedStatus: string;
  yearBuilt?: number;
  notes?: string;
  agent: {
    id: string;
    firstName: string;
    lastName: string;
  };
  images: PropertyImage[];
  leads: Lead[];
  propertyVisits: PropertyVisit[];
  _count: { leads: number; propertyVisits: number };
  createdAt: string;
  updatedAt: string;
}

const MOCK_PROPERTIES: Record<string, Property> = {
  "1": {
    id: "1",
    title: "Luxury Villa in Downtown",
    description: "Beautiful 4-bedroom luxury villa with modern amenities in the heart of downtown.",
    type: "VILLA",
    status: "AVAILABLE",
    price: 500000,
    originalPrice: 550000,
    address: "123 Main St, Downtown",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    latitude: 40.7128,
    longitude: -74.006,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3500,
    furnishedStatus: "SEMI_FURNISHED",
    yearBuilt: 2015,
    notes: "Recently renovated, move-in ready property with excellent location.",
    agent: { id: "1", firstName: "John", lastName: "Agent" },
    images: [],
    leads: [],
    propertyVisits: [],
    _count: { leads: 5, propertyVisits: 3 },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "2": {
    id: "2",
    title: "Modern Apartment Complex",
    description: "Contemporary apartment building with eco-friendly features.",
    type: "APARTMENT",
    status: "RENTED",
    price: 350000,
    address: "456 Oak Ave, Midtown",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    latitude: 34.0522,
    longitude: -118.2437,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    furnishedStatus: "UNFURNISHED",
    yearBuilt: 2018,
    notes: "Great investment property with strong rental income potential.",
    agent: { id: "2", firstName: "Sarah", lastName: "Contractor" },
    images: [],
    leads: [],
    propertyVisits: [],
    _count: { leads: 2, propertyVisits: 1 },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "3": {
    id: "3",
    title: "Commercial Office Space",
    type: "COMMERCIAL",
    status: "AVAILABLE",
    price: 750000,
    address: "789 Elm St, Business District",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    latitude: 41.8781,
    longitude: -87.6298,
    squareFeet: 5000,
    furnishedStatus: "FURNISHED",
    yearBuilt: 2010,
    agent: { id: "1", firstName: "John", lastName: "Agent" },
    images: [],
    leads: [],
    propertyVisits: [],
    _count: { leads: 8, propertyVisits: 5 },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data.data || null);
          setUseMockData(false);
        } else {
          // Fall back to mock data
          const mockProperty = MOCK_PROPERTIES[propertyId];
          if (mockProperty) {
            setProperty(mockProperty);
            setUseMockData(true);
          } else {
            toast.error("Property not found");
            router.push("/dashboard/properties");
          }
        }
      } catch (error) {
        console.warn("Failed to fetch property, using mock data:", error);
        const mockProperty = MOCK_PROPERTIES[propertyId];
        if (mockProperty) {
          setProperty(mockProperty);
          setUseMockData(true);
        } else {
          toast.error("Failed to load property");
          router.push("/dashboard/properties");
        }
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, router]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Property deleted successfully");
        router.push("/dashboard/properties");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      toast.error("Error deleting property");
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

  if (!property) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/properties" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} />
          Back to Properties
        </Link>
        <div className="card flex-center min-h-[400px]">
          <p className="text-gray-500 text-lg">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-1">
            <MapPin size={16} />
            {property.address}, {property.city}
          </p>
          {useMockData && (
            <p className="text-sm text-amber-600 mt-2">⚠️ Showing mock data (API unavailable)</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/properties/${property.id}/edit`} className="btn-secondary px-4 py-2 flex items-center gap-2">
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
        {/* Left Column - Property Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Section */}
          <div className="card">
            <div className="flex-between">
              <div>
                <p className="text-gray-600 text-sm">Listed Price</p>
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(property.price)}</p>
              </div>
              <div className="text-right">
                <span className={`badge-${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>
            {property.originalPrice && property.originalPrice > property.price && (
              <p className="text-sm text-gray-600 mt-2">
                Original price: {formatCurrency(property.originalPrice)}
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 py-2">
                <span className="badge-primary">{property.type}</span>
              </div>
              {property.bedrooms && (
                <div className="py-2">
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-gray-900 font-medium">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms && (
                <div className="py-2">
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-gray-900 font-medium">{property.bathrooms}</p>
                </div>
              )}
              {property.squareFeet && (
                <div className="py-2">
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="text-gray-900 font-medium">{property.squareFeet.toLocaleString()} sq ft</p>
                </div>
              )}
              {property.yearBuilt && (
                <div className="py-2">
                  <p className="text-sm text-gray-600">Year Built</p>
                  <p className="text-gray-900 font-medium">{property.yearBuilt}</p>
                </div>
              )}
              {property.furnishedStatus && (
                <div className="py-2">
                  <p className="text-sm text-gray-600">Furnished Status</p>
                  <p className="text-gray-900 font-medium">{property.furnishedStatus.replace(/_/g, " ")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Notes */}
          {property.notes && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600 leading-relaxed">{property.notes}</p>
            </div>
          )}

          {/* Interested Leads */}
          {property.leads.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interested Leads ({property.leads.length})</h2>
              <div className="space-y-2">
                {property.leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="flex-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                    <span className="badge-primary">{lead.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Side Information */}
        <div className="space-y-6">
          {/* Agent Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent</h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                {property.agent.firstName} {property.agent.lastName}
              </p>
              <Link
                href={`/dashboard/settings#agent-${property.agent.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Location Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">City:</span>
                <span className="text-gray-900 ml-1 font-medium">{property.city}</span>
              </p>
              {property.state && (
                <p>
                  <span className="text-gray-600">State:</span>
                  <span className="text-gray-900 ml-1 font-medium">{property.state}</span>
                </p>
              )}
              {property.zipCode && (
                <p>
                  <span className="text-gray-600">Zip Code:</span>
                  <span className="text-gray-900 ml-1 font-medium">{property.zipCode}</span>
                </p>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
            <div className="space-y-3">
              <div className="flex-between">
                <span className="text-gray-600">Interested Leads</span>
                <span className="font-bold text-lg text-blue-600">{property._count.leads}</span>
              </div>
              <div className="flex-between border-t border-gray-200 pt-3">
                <span className="text-gray-600">Property Visits</span>
                <span className="font-bold text-lg text-green-600">{property._count.propertyVisits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    AVAILABLE: "success",
    RENTED: "warning",
    SOLD: "danger",
    UNDER_OFFER: "warning",
    INACTIVE: "secondary",
  };
  return colorMap[status] || "primary";
}

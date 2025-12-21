import { useState } from "react";
import { useGetInvoicesQuery } from "@/lib/redux/query";
import { Link } from "react-router";
import { FileText, Calendar, Zap, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

const InvoicesPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: invoices, isLoading, isError, error } = useGetInvoicesQuery({ status: statusFilter });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading invoices: {error?.data?.message || error?.message}</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PAID: "bg-green-100 text-green-800 border-green-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
    };

    const statusIcons = {
      PENDING: <Clock className="w-4 h-4" />,
      PAID: <CheckCircle className="w-4 h-4" />,
      FAILED: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
        {statusIcons[status]}
        {status}
      </span>
    );
  };

  const calculateAmount = (energyKWh) => {
    const pricePerKWh = 0.05; // $0.05 per kWh - this matches your Stripe price
    return (energyKWh * pricePerKWh).toFixed(2);
  };

  return (
    <main className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Invoices</h1>
          <p className="text-gray-600 mt-2">View and manage your solar energy billing</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setStatusFilter("")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              statusFilter === ""
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Invoices
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              statusFilter === "PENDING"
                ? "border-yellow-600 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("PAID")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              statusFilter === "PAID"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* Invoices Grid */}
      {invoices?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            {statusFilter
              ? `You don't have any ${statusFilter.toLowerCase()} invoices.`
              : "Invoices will appear here once they are generated monthly based on your solar unit's energy generation."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {invoices?.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-500">
                    {invoice.solarUnitId?.serialNumber || "N/A"}
                  </span>
                </div>
                {getStatusBadge(invoice.paymentStatus)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {format(new Date(invoice.billingPeriodStart), "MMM d")} -{" "}
                    {format(new Date(invoice.billingPeriodEnd), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {invoice.totalEnergyGenerated.toFixed(2)} kWh
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    ${calculateAmount(invoice.totalEnergyGenerated)}
                  </span>
                </div>

                {invoice.paymentStatus === "PAID" && invoice.paidAt && (
                  <div className="text-xs text-gray-500">
                    Paid on {format(new Date(invoice.paidAt), "MMM d, yyyy")}
                  </div>
                )}
              </div>

              {invoice.paymentStatus === "PENDING" && (
                <Link
                  to={`/dashboard/invoices/${invoice._id}/pay`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Pay Now
                </Link>
              )}

              {invoice.paymentStatus === "FAILED" && (
                <Link
                  to={`/dashboard/invoices/${invoice._id}/pay`}
                  className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Retry Payment
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default InvoicesPage;

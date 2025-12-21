import { useParams, Link } from "react-router";
import { useGetInvoiceByIdQuery } from "@/lib/redux/query";
import CheckoutForm from "./components/CheckoutForm";
import { ArrowLeft, FileText, Calendar, Zap, DollarSign } from "lucide-react";
import { format } from "date-fns";

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const { data: invoice, isLoading, isError, error } = useGetInvoiceByIdQuery(invoiceId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-900 font-semibold mb-2">Error Loading Invoice</h2>
          <p className="text-red-600">{error?.data?.message || error?.message}</p>
          <Link
            to="/dashboard/invoices"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const calculateAmount = (energyKWh) => {
    const pricePerKWh = 0.05; // $0.05 per kWh
    return (energyKWh * pricePerKWh).toFixed(2);
  };

  return (
    <main className="mt-4 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/dashboard/invoices"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </Link>

      {/* Invoice Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Invoice Summary</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Solar Unit</h3>
            <p className="text-gray-900 font-semibold">
              {invoice.solarUnitId?.serialNumber || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Capacity: {invoice.solarUnitId?.capacity || "N/A"} kW
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Period</h3>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {format(new Date(invoice.billingPeriodStart), "MMM d, yyyy")} -{" "}
                {format(new Date(invoice.billingPeriodEnd), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Energy Generated</h3>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900">
                {invoice.totalEnergyGenerated.toFixed(2)} kWh
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Amount Due</h3>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-3xl font-bold text-gray-900">
                ${calculateAmount(invoice.totalEnergyGenerated)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Rate: $0.05 per kWh
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
        <CheckoutForm invoiceId={invoiceId} />
      </div>
    </main>
  );
};

export default PaymentPage;

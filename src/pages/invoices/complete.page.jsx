import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { useGetSessionStatusQuery } from "@/lib/redux/query";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const PaymentCompletePage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [shouldFetch, setShouldFetch] = useState(false);

  // Delay the fetch slightly to allow webhook to process
  useEffect(() => {
    if (sessionId) {
      const timer = setTimeout(() => {
        setShouldFetch(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionId]);

  const { data, isLoading, isError, error } = useGetSessionStatusQuery(sessionId, {
    skip: !sessionId || !shouldFetch,
  });

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h1>
          <p className="text-gray-600 mb-6">No session ID found in URL</p>
          <Link
            to="/dashboard/invoices"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !shouldFetch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            {error?.data?.message || error?.message || "Failed to verify payment status"}
          </p>
          <Link
            to="/dashboard/invoices"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = data?.paymentStatus === "paid";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isSuccess ? (
            <>
              <div className="mb-6">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your payment has been processed successfully.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-green-600">
                  ${((data.amountTotal || 0) / 100).toFixed(2)}
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/dashboard/invoices"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View All Invoices
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                We couldn't process your payment. Please try again or contact support if the issue persists.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-red-600">
                  {data?.status || "Failed"}
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/dashboard/invoices"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCompletePage;

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface StripeCheckoutProps {
  serviceName: string;
  serviceId: string;
  monthlyPrice: number;
  description?: string;
}

const SimplifiedStripeCheckout = ({
  serviceName,
  serviceId,
  monthlyPrice,
  description = "Monthly subscription",
}: StripeCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/auth/subscriptions/activate",
        { email: user?.email, plan: serviceId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            subs: serviceId,
          }),
        );

        // Redirect to Flouci's payment URL
        window.location.href = res.data.result.link;
      } else {
        console.error("No payment link received from server.");
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" min-h-screen  bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
            <h2 className="text-xl font-bold text-white">
              Service Subscription
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900">
                {serviceName}
              </h3>
              {description && (
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              )}

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Monthly fee
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(monthlyPrice)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Billed monthly. Cancel anytime.
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isLoading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Subscribe for ${formatCurrency(monthlyPrice)}/month`
              )}
            </button>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-center">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedStripeCheckout;

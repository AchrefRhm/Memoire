"use client";
import SimplifiedStripeCheckout from "@/components/StripeCheckout";
import StripeCheckout from "@/components/StripeCheckout";
import React from "react";

const page = () => {
  // Add more items as needed

  return (
    <div>
      <SimplifiedStripeCheckout
        serviceName="Premium Plan"
        serviceId="premium"
        monthlyPrice={1900} // in cents, so $29.99
        description="Access to all premium features and support"
      />
    </div>
  );
};

export default page;

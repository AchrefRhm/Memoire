"use client";
import SimplifiedStripeCheckout from "@/components/StripeCheckout";
import StripeCheckout from "@/components/StripeCheckout";
import React from "react";

const page = () => {
  return (
    <div>
      <SimplifiedStripeCheckout
        serviceName="Ultimate Plan"
        serviceId="ultimate"
        monthlyPrice={3900} // in cents, so $29.99
        description="Access to all ultimate features and support"
      />
    </div>
  );
};

export default page;

import React, { useState, useEffect } from "react";
import { useSumTypeFetch } from "./hooks/useSumTypeFetch";
import { AddressFormLoading } from "./components/AddressFormLoading";

export function AddressFormPage() {
  // pretend fetch result
  const addressFetchResult = useSumTypeFetch<Address>(
    // value of pretend "data" result, if no pretend "error"
    {
      addressLine1: "117 Red Cedar St",
      addressLine2: "",
      city: "Rexburg",
      state: "UT",
      zipCode: "94103",
    }
  );

  // form state initially "loading", until result of fetch
  const [addressFormLoading, setAddressFormLoading] = useState<
    Address | "loading"
  >("loading");
  // initialize form after fetch result
  useEffect(() => {
    switch (addressFetchResult.kind) {
      case "uncalled":
      case "loading":
        // form remains "loading" until result of fetch
        return;
      case "error":
        // can still fill out blank form, despite "error" fetching it
        return setAddressFormLoading({
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zipCode: "",
        });
      case "data":
        // form set with "data" from server

        return setAddressFormLoading(addressFetchResult.data);
    }
    // react-hooks/exhaustive-deps does not support tagged union types
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressFetchResult.kind]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* this must be function to force inner switch to handle all cases */}
      {(() => {
        // addressFormLoading properties can't be accessed unless "loading" is handled
        if (addressFormLoading === "loading") {
          return <AddressFormLoading />;
        }

        // switch must be final return to type-check that all cases are handled
        switch (addressFetchResult.kind) {
          case "uncalled":
          case "loading":
            // pretend this is a beautiful skeleton
            return <AddressFormLoading />;
          case "error":
          case "data":
            return (
              <>
                {/* type must be narrowed to "error" or message is inaccessible */}
                {addressFetchResult.kind === "error"
                  ? addressFetchResult.message
                  : null}

                <input value={addressFormLoading.addressLine1} />
                <input value={addressFormLoading.addressLine2} />
                <input value={addressFormLoading.city} />
                <input value={addressFormLoading.state} />
                <input value={addressFormLoading.zipCode} />

                <button>Submit</button>
              </>
            );
        }
      })()}
    </div>
  );
}

type Address = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
};

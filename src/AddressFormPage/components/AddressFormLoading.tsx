import React from "react";

/**
 * pretend this is a beautiful skeleton (light solid boxes where content is expected to load)
 */
export function AddressFormLoading() {
  return (
    <>
      <div className="input-loading">loading input</div>
      <div className="input-loading">loading input</div>
      <div className="input-loading">loading input</div>
      <div className="input-loading">loading input</div>
      <div className="input-loading">loading input</div>

      <button className="button-loading" disabled={true}>
        Submit
      </button>
    </>
  );
}

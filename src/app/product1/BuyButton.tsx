"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  paypalClientId: string;
  price: string;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: unknown) => { render: (selector: string | HTMLElement) => void };
    };
  }
}

export function BuyButton({ paypalClientId, price }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!paypalClientId || !containerRef.current) return;
    setStatus("loading");

    const scriptId = "paypal-sdk";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    function renderButtons() {
      if (!window.paypal || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.paypal
        .Buttons({
          createOrder: async () => {
            const res = await fetch("/api/paypal/create-order", { method: "POST" });
            if (!res.ok) throw new Error("create failed");
            const data = await res.json();
            return data.id;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await fetch("/api/paypal/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            });
            if (!res.ok) {
              setStatus("error");
              setMessage("Payment could not be verified. If you were charged, contact support.");
              return;
            }
            setStatus("success");
            setMessage("Payment complete! Refreshing your downloads...");
            window.location.href = "/checkout/success";
          },
          onError: () => {
            setStatus("error");
            setMessage("Payment failed. Please try again.");
          },
        })
        .render(containerRef.current);
      setStatus("ready");
    }

    if (existing && window.paypal) {
      renderButtons();
      return;
    }
    if (!existing) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=USD`;
      script.onload = renderButtons;
      script.onerror = () => {
        setStatus("error");
        setMessage("Could not load PayPal.");
      };
      document.body.appendChild(script);
    } else {
      existing.addEventListener("load", renderButtons);
    }
  }, [paypalClientId]);

  if (!paypalClientId) {
    return (
      <div className="pricing-info">
        <p>Online card/PayPal checkout is not configured yet. Please use bank transfer below, or the external Amazon links.</p>
      </div>
    );
  }

  return (
    <div className="pricing-info">
      <strong>Buy the e-book — {price}</strong>
      <div ref={containerRef} style={{ marginTop: 12, minHeight: 46 }} />
      {status === "loading" ? <p>Loading payment options...</p> : null}
      {message ? <p className={status === "error" ? "status-error" : "status-success"}>{message}</p> : null}
    </div>
  );
}

import { NextResponse } from "next/server";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { capturePayPalOrder, PayPalApiError } from "@/lib/paypal/api";
import { PayPalConfigurationError } from "@/lib/paypal/config";
import {
  getUserPayPalOrder,
  storeCapturedPayPalOrder,
} from "@/lib/paypal/firestore";
import { getPurchaseBySlug } from "@/lib/purchases";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const { orderId } = await params;
    const existingOrder = await getUserPayPalOrder({
      uid: requestUser.uid,
      orderId,
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "The requested PayPal order could not be found for this user.",
        },
        { status: 404 }
      );
    }

    if (existingOrder.paymentStatus === "paid") {
      return NextResponse.json({
        orderId: existingOrder.orderId,
        status: existingOrder.paypalStatus || "COMPLETED",
        paymentStatus: existingOrder.paymentStatus,
      });
    }

    const purchase = getPurchaseBySlug(existingOrder.agreementSlug);

    if (!purchase) {
      return NextResponse.json(
        {
          error: "The PayPal order points to an unknown package.",
        },
        { status: 409 }
      );
    }

    const order = await capturePayPalOrder(orderId);

    await storeCapturedPayPalOrder({
      order,
      existingOrder,
      purchase,
      requestUser,
    });

    return NextResponse.json({
      orderId: order.id,
      status: order.status || "COMPLETED",
      paymentStatus: "paid",
      payerEmail:
        order?.payer?.email_address || order?.payment_source?.paypal?.email_address || "",
    });
  } catch (error) {
    if (error instanceof FirebaseAuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof FirebaseAdminConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
        },
        { status: 500 }
      );
    }

    if (error instanceof PayPalConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
        },
        { status: 500 }
      );
    }

    if (error instanceof PayPalApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status }
      );
    }

    console.error("Unexpected PayPal capture error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while capturing the PayPal payment.",
      },
      { status: 500 }
    );
  }
}

import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "../../utils/subscription.utils";
import { IGetPaymentHistoryQuery } from "./subscription.interface";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // Check whether the user already has a Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Create a new Stripe customer if one doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Save Stripe customer ID in the User table
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    console.log("Stripe Customer ID:", stripeCustomerId);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      success_url: `${config.app_url}/payment?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });

    return {
      paymentUrl: session.url,
      sessionId: session.id,
    };
  });

  return transactionResult;
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      // Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
      // const paymentObject = event.data.object;
      await handleChangeSubscription(event.data.object);

      break;
    case "customer.subscription.deleted":
      // Occurs whenever a customer’s subscription ends.
      // const paymentObject = event.data.object;
      await handleChangeSubscription(event.data.object);

      break;
    default:
      // Unexpected event type
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExist = await prisma.subscription.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const isActive =
    isSubscriptionExist.status === "ACTIVE" &&
    isSubscriptionExist.currentPeriodEnd &&
    new Date(isSubscriptionExist.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExist.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExist.currentPeriodEnd,
  };
};

const getSubscriptionDetailsFromDB = async () => {
  const allSubscriptionDetails = await prisma.subscription.findMany();
  return allSubscriptionDetails;
};

const stripe = new Stripe(config.stripe_secret_key as string);

const getPaymentHistoryFromStripe = async (
  payload: IGetPaymentHistoryQuery,
) => {
  // console.log("Payload:", payload);

  const paymentIntents = await stripe.paymentIntents.list({
    customer: payload.customerId,
    limit: payload.limit || 10,
  });

  // console.log(paymentIntents);
  const result = await Promise.all(
    paymentIntents.data.map(async (payment) => {
      let invoice = null;
      const invoiceReference = (
        payment as Stripe.PaymentIntent & {
          invoice?: string | Stripe.Invoice | null;
        }
      ).invoice;

      if (typeof invoiceReference === "string") {
        invoice = await stripe.invoices.retrieve(invoiceReference);
      }

      return {
        paymentIntentId: payment.id,
        invoiceId: invoice?.id ?? null,
        customerId: payment.customer,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        receiptEmail: payment.receipt_email,
        createdAt: new Date(payment.created * 1000),
        invoicePdf: invoice?.invoice_pdf ?? null,
        invoiceUrl: invoice?.hosted_invoice_url ?? null,
        subscriptionId:
          invoice &&
          invoice.parent &&
          typeof invoice.parent === "object" &&
          "subscription_details" in invoice.parent
            ? invoice.parent.subscription_details?.subscription
            : null,
      };
    }),
  );

  return result;
};
export const subscriptionServices = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  getSubscriptionDetailsFromDB,
  getPaymentHistoryFromStripe,
};

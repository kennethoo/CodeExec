const subScriptionPlan = [
  { name: "month", price: 1800, planId: "1" },
  { name: "6 month", price: 8900, planId: "2" },
  { name: "Year", price: 17000, planId: "3" },
];

import { PAYMENT_SUCCEEDED } from "../constant/paymentStatus.js";

import Customer from "../models/customer.js";
import stripe from "../config/stripe.js";
import moment from "moment";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { transactionApi } from "./transaction.js";
import { userManager } from "./user.js";

const meettumSubscription = new Schema({
  subScriberId: String,
  lastPaymentDate: String,
  nextPaymentDate: String,
  status: Boolean,
  planId: String,
  paymentIntentId: String,
});

const Subscription = mongoose.model("subscription", meettumSubscription);
class MeettumSubscription {
  constructor() {}

  createSubScriptionIntent = async (payload) => {
    try {
      const { planId, user } = payload;
      const plan = subScriptionPlan.find((option) => option.planId == planId);

      if (!plan || !user || !planId) {
        return { succeeded: false, errorMessage: "invalid Input" };
      }

      const { price } = plan;
      const { userId, email } = user;
      const result = await Customer.findOne({ userId });
      let customer = null;
      if (result) {
        customer = result;
      } else {
        const stripeCustomer = await stripe.customers.create({
          name: userId,
          email,
        });
        customer = await Customer.create({
          customerId: stripeCustomer.id,
          email: email,
          userId,
          paymentMethods: [],
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        customer: customer.customerId,
        setup_future_usage: "off_session",
        metadata: { email: email, userId },
        currency: "usd",
        amount: price,
        payment_method_types: ["card"],
        payment_method_options: {
          card: {
            setup_future_usage: "off_session",
          },
        },
      });

      return { succeeded: true, clientSecret: paymentIntent.client_secret };
    } catch (err) {
      return { succeeded: false, errorMessage: err.message };
    }
  };

  saveUserPayMentOption = async (payload) => {
    try {
      const { subScriberId, paymentMethodeId } = payload;
      const paymentMethodInfo =
        await stripe.paymentMethods.retrieve(paymentMethodeId);
      const brand = paymentMethodInfo.card.brand;
      const last4 = paymentMethodInfo.card.last4;
      await Customer.updateOne(
        { userId: subScriberId, paymentMethods: { $exists: true } },
        { $set: { "paymentMethods.$[].isDefault": false } }
      );
      await Customer.findOneAndUpdate(
        { userId: subScriberId },
        {
          $push: {
            paymentMethods: {
              token: paymentMethodeId,
              isDefault: true,
              ending: last4,
              brand: brand,
            },
          },
        }
      );
      return { succeeded: true };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message };
    }
  };

  createSubScription = async (payload) => {
    const { user, planId, paymentIntentId, paymentMethodeId } = payload;
    if (!user || !planId || !paymentIntentId || !paymentMethodeId) {
      return { succeeded: false, errorMessage: "invalid Input" };
    }
    const planResult = this.getPlanInfo(planId);
    if (!planResult.succeeded) {
      return { succeeded: false, errorMessage: "invalid Input" };
    }

    const { price } = planResult;
    const { userId } = user;
    const lastPaymentDate = moment.utc().format("YYYY-MM-DD");
    //fetch the user prev plan if he does have one
    const { subscriptions } = await this.getAllUserSuScription(userId);

    const lastSubScription = subscriptions[subscriptions.length - 1];

    let prevPaymentDate = undefined;
    if (lastSubScription) {
      prevPaymentDate = lastSubScription.nextPaymentDate;
    }

    const nextPaymentDate = this.getNextPaymentDate(planId, prevPaymentDate);
    const subscriptionPayload = {
      subScriberId: userId,
      lastPaymentDate,
      nextPaymentDate,
      status: true,
      planId,
      paymentIntentId,
    };
    await this.saveUserPayMentOption({
      subScriberId: userId,
      paymentMethodeId,
    });
    await Subscription.create(subscriptionPayload);
    await userManager.upgrateUserToMeettumPro(userId);
    transactionApi.createTransaction({
      userId,
      amountTransacted: price,
      isAmountTransactedToMeettumUser: false,
      paymentIntentId,
      receiverUserId: "Meettum",
    });
    return { succeeded: true, message: "Welcome to Meettum Pro" };
  };

  getNextPaymentDate = (planId, prevPaymentDate) => {
    let nextDateOfPaying = "";
    switch (planId) {
      case "1":
        nextDateOfPaying = moment
          .utc(prevPaymentDate)
          .add(30, "days")
          .format("YYYY-MM-DD");
        break;
      case "2":
        nextDateOfPaying = moment
          .utc(prevPaymentDate)
          .add(180, "days")
          .format("YYYY-MM-DD");
        break;
      case "3":
        nextDateOfPaying = moment(prevPaymentDate)
          .add(365, "days")
          .format("YYYY-MM-DD");
        break;
    }
    return nextDateOfPaying;
  };

  getPlanInfo = (planId) => {
    const plan = subScriptionPlan.find((option) => option.planId == planId);
    if (!plan) {
      return { succeeded: false, plan };
    }

    return { succeeded: true, ...plan };
  };

  getUserSuScription = async (userId) => {
    try {
      const subscription = await Subscription.findOne({
        subScriberId: userId,
        status: true,
      });

      if (!subscription) {
        return { succeeded: true, isSubScribe: false };
      }

      const otherSubInfo = {
        lastPaymentDate: subscription.lastPaymentDate,
        nextPaymentDate: subscription.nextPaymentDate,
      };
      const plan = this.getPlanInfo(subscription.planId);
      return { ...plan, ...otherSubInfo, isSubScribe: true };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message };
    }
  };

  getAllUserSuScription = async (userId) => {
    try {
      const subscriptions = await Subscription.find({
        subScriberId: userId,
      });

      return { succeeded: true, subscriptions };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message };
    }
  };

  cancelUserSubScrio = async (userId, body) => {
    try {
      const { planId } = body;
      if (!userId || !planId) {
        return { succeeded: false, errorMessage: "invalid input " };
      }
      const plandDetails = this.getPlanInfo(planId);
      if (!plandDetails.succeeded) {
        return {
          succeeded: false,
          errorMessage: plandDetails.errorMessage,
        };
      }

      await Subscription.updateMany(
        {
          subScriberId: userId,
          planId,
        },
        { status: false }
      );

      return { succeeded: true };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message };
    }
  };

  getCustomerPaymentMethode = async (userId) => {
    try {
      const result = await Customer.findOne({ userId });
      return { succeeded: true, result };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message, result: {} };
    }
  };

  getUserMainPayMethode = async (userId) => {
    try {
      const result = await Customer.findOne({ userId });
      if (!result) {
        return { succeeded: false, errorMessage: "no option" };
      }
      const defaultMethide = result.paymentMethods.find((paymentMethods) => {
        paymentMethods.isDefault;
      });
      return { succeeded: true, defaultMethide };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message, result: {} };
    }
  };

  removeUserPaymentOption = async (payload) => {
    try {
      const { token, brand, ending, isDefault, userId } = payload;
      if ((!token || !isDefault, !brand || !ending)) {
        return { succeeded: false, errorMessage: "Invalid Input" };
      }
      await stripe.paymentMethods.detach(token);
      const result = await Customer.updateOne(
        { userId },
        {
          $pull: {
            paymentMethods: {
              token,
              isDefault,
              brand,
              ending,
            },
          },
        }
      );

      if (!result) {
        return { succeeded: false, errorMessage: "Invalid Input" };
      }

      return { succeeded: true };
    } catch (error) {
      return { succeeded: false, errorMessage: error.message };
    }
  };

  markPaymentInfoAsDefault = async ({ userId, token }) => {
    await Customer.updateOne(
      { userId },
      {
        $set: { "paymentMethods.$[].isDefault": false },
      }
    );
    await Customer.updateOne(
      { "paymentMethods.token": token },
      { $set: { "paymentMethods.$.isDefault": true } }
    );

    return { succeeded: true };
  };

  chargeUserForMeettumSubScription = async (userSubscription) => {
    const { subScriberId } = userSubscription;
    const customerPayment =
      await meetumCodeSubscriptionApi.getCustomerPaymentMethode(subScriberId);
    if (!customerPayment.succeeded) {
      return { succeeded: false, errorMessage: "something went wring" };
    }
    const { customerId } = customerPayment.result;
    const { paymentMethods } = customerPayment.result;
    const tokenChoose = paymentMethods.find((item) => item.isDefault === true);

    if (!tokenChoose) {
      return { succeeded: false, errorMessage: "something went wring" };
    }

    const planInfo = await this.getPlanInfo(userSubscription.planId);
    if (!planInfo.succeeded) {
      return { succeeded: false, errorMessage: "something went wring" };
    }
    const { price } = planInfo;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      customer: customerId,
      payment_method: tokenChoose.token,
      off_session: true,
      confirm: true,
    });
    if (paymentIntent.status == PAYMENT_SUCCEEDED) {
      transactionApi.createTransaction({
        userId: subScriberId,
        amountTransacted: price,
        isAmountTransactedToMeettumUser: false,
        paymentIntentId: paymentIntent.id,
        receiverUserId: "Meettum",
      });
      userSubscription.nextDateOfPaying = this.getNextPaymentDate(
        userSubscription.planId
      );
      await userSubscription.save();

      return { succeeded: true };
    } else {
      return { succeeded: false, errorMessage: "something went wring" };
    }
  };

  removeUserSubScrioption = async (userSubscription) => {
    const {
      subScriberId,
      planId,
      lastPaymentDate,
      nextPaymentDate,
      status,
      paymentIntentId,
    } = userSubscription;

    await Subscription.deleteOne({
      subScriberId,
      planId,
      lastPaymentDate,
      nextPaymentDate,
      status,
      paymentIntentId,
    });
    return { succeeded: true };
  };
}

export const meetumCodeSubscriptionApi = new MeettumSubscription();

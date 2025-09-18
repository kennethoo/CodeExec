import moment from "moment";
import { meettumSubscriptionApi } from "../application/meettumSubscription";

import { userManager } from "./application/user.js";

async function collectSubscription() {
  const today = moment.utc().format("YYYY-MM-DD");
  //Collect a all user
  const { users } = await userManager.internalGetUsers({ isProUser: true });

  for (const user of users) {
    //get user subsctition
    const { userId } = user;

    const { succeeded, subscriptions } =
      await meettumSubscriptionApi.getAllUserSuScription(userId);
    if (!succeeded) {
      return;
    }

    for (const subscription of subscriptions) {
      if (subscription.nextDateOfPaying === today) {
        if (subscription.status === true) {
          const transactionResult =
            await meettumSubscriptionApi.chargeUserForMeettumSubScription(
              subscription
            );
          if (!transactionResult.succeeded) {
            //email ther user lol

            await meettumSubscriptionApi.removeUserSubScrioption(
              subscription._doc
            );
          }
        } else {
          await meettumSubscriptionApi.removeUserSubScrioption(
            subscription._doc
          );
        }
      }
    }

    const { subscriptions: allSubSctiotionLeft } =
      await meettumSubscriptionApi.getAllUserSuScription(userId);

    if (allSubSctiotionLeft.length == 0) {
      userManager.removeUserProMetttumPro(userId);
    }
  }
}

module.exports = collectSubscription;

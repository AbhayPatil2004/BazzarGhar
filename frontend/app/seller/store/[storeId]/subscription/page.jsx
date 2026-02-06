import SubscriptionHero from "./components/SubscriptionHero"
// import SubscriptionPage from "../../../../subscription/[storeid]/page"
import SubscriptionPlansPage from "./components/SubscriptionPlans"
import { SubscriptionFAQ } from "./components/SubscriptionFaq"
import { SubscriptionCTA } from "./components/SubscriptionCTA"


export default function Page(){

    return (
        <div>
            <SubscriptionHero></SubscriptionHero>
            <SubscriptionPlansPage></SubscriptionPlansPage>
            <SubscriptionFAQ></SubscriptionFAQ>
            <SubscriptionCTA></SubscriptionCTA>
        </div>
    )
}
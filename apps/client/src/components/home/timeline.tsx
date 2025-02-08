import { client } from "@/utils/client";
import { evmAddress } from "@lens-protocol/client";
import { currentSession, fetchTimeline } from "@lens-protocol/client/actions";
import { Button } from "@/components/ui/button";
import { useCredentialStore } from "@/store/store";
import { getSession } from "@/utils/auth/auth";

export default function Timeline() {
    const lens_address = useCredentialStore(state => state.lens_address)

    async function fetch_timeline() {
        // const result = await fetchTimeline(client, {
        //     account: evmAddress(lens_address!),
        // });

        const result = await fetchTimeline(client, {
            account: evmAddress(lens_address!),
            filter: {
              feeds: [
                {
                  globalFeed: true,
                },
              ],
            },
          });

        if (result.isErr()) {
            return console.error(result.error);
        }

        const { items, pageInfo } = result.value;
        console.log('tl items=', items)
    }

    async function checkAuthStatus() {
        const sessionClient = await getSession()
        const result = await sessionClient!.getAuthenticatedUser()
        console.log('auth status=', result)
    }



    return (
        <div>
            <p>Timeline</p>
            <Button onClick={fetch_timeline}>Fetch Timeline</Button>
            <Button onClick={checkAuthStatus}>Check auth</Button>
        </div>
    )
}
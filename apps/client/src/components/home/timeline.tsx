import { client } from "@/utils/client";
import { evmAddress } from "@lens-protocol/client";
import { currentSession, fetchTimeline } from "@lens-protocol/client/actions";
import { Button } from "@/components/ui/button";
import { useCredentialStore } from "@/store/store";
import { checkAuthStatus, getSession } from "@/utils/auth/auth";
import { app_address } from "@/utils/env";


export default function Timeline() {
    const lens_address = useCredentialStore(state => state.lens_address)

    async function fetch_timeline() {
        // const result = await fetchTimeline(client, {
        //     account: evmAddress(lens_address!),
        // });

        const result = await fetchTimeline(client, {
            account: evmAddress(lens_address!),
            filter: {
              apps: [
                evmAddress(app_address),
              ],
            },
          });

        if (result.isErr()) {
            return console.error(result.error);
        }

        const { items, pageInfo } = result.value;
        console.log('tl items=', items)
    }

    



    return (
        <div>
            <p>Timeline</p>
            <Button onClick={fetch_timeline}>Fetch Timeline</Button>
            <Button onClick={checkAuthStatus}>Check auth</Button>
        </div>
    )
}
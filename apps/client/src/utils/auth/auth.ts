import { addAccountManager, createAccountWithUsername, createApp, enableSignless } from "@lens-protocol/client/actions";
import { client } from "../client";
import { storageClient } from "../storageclient";
import { walletClient } from "../viem";
import { evmAddress, uri } from "@lens-protocol/client";
import { handleWith } from "@lens-protocol/client/viem";
import { app_address } from "../env";
import { signMessage } from "@wagmi/core";
import { config } from "@/contexts/WagmiContext";
import { sendEip712Transaction } from "viem/zksync";
import { sendGraphQLQuery } from "../query";
import { app, Platform } from "@lens-protocol/metadata";

async function uploadAppMeta() {
    const metadata = app({
        name: "autozone",
        tagline: "The zone to be",
        description: "The car social app",
        logo: "lens://adf9f84bd89932b1098bb44aca30afc7f7ee0269205e80fd40bb8f75032a8fd2",
        developer: "invincible007 invincible007@gmail.com",
        url: "https://example.com",
        termsOfService: "https://example.com/terms",
        privacyPolicy: "https://example.com/privacy",
        platforms: [Platform.WEB],
    })

    const { uri } = await storageClient.uploadAsJson(metadata)
    console.log('app meta uri=> ', uri)
    return uri

}

export async function create_App() {
    const meta_uri = await uploadAppMeta()
    const sessionClient = await authAsBuilder(walletClient.account!.address)

    const result = await createApp(sessionClient!, {
        metadataUri: uri(meta_uri), // the URI from the previous step
    }).andThen(handleWith(walletClient))
    .andThen(sessionClient!.waitForTransaction);
    console.log('create app result=>', result);
    //example result
    // {
    //     "value": "0xe7fd241c955b0aa3b677c35fd94f4d90d315c4e30b9689be6af8ed8f39955e0f"
    // }

}


export async function authAsBuilder(address: `0x${string}`) {
    try {
        const authenticated = await client.login({
            builder: {
                address,
            },
            signMessage: (message) => signMessage(config, { message }),
        })

        if (authenticated.isErr()) {
            throw authenticated.error
        }

        const sessionClient = authenticated.value;
        return sessionClient;
    } catch (error) {
        console.error('Failed to authenticate as builder:', error);
        throw error
    }
}


// export async function authenticate_with_challenge(user_address: `0x${string}`) {
//     const challenge = await client.challenge({
//         accountOwner: {
//             account: "0x8934FDcdE26590e41143b1e9fC8c0bD5910395E7",
//             owner: user_address,
//             app: app_address
//         }
//     })
//     console.log('chall->', challenge);

//     const authenticated = await client.authenticate({
//         id: challenge.value.id,
//         signature: signatureFrom(await signMessage(config, { message: challenge.value.text }))
//     })
//     console.log('authed->', authenticated)

//     const user = await authenticated.value.getAuthenticatedUser()
//     console.log('user->', user);
//     return user

// }

export async function loginAsOnboardingUser(address: `0x${string}`) {
    const authenticated = await client.login({
        onboardingUser: {
            app: app_address,
            wallet: address,
        },
        signMessage: (message) => signMessage(config, { message }),
    })

    if (authenticated.isErr()) {
        return console.error(authenticated.error);
    }

    const sessionClient = authenticated.value
    console.log("onboarded, sessioclient=> ", sessionClient);
    return sessionClient
}

export async function createAccount(address: `0x${string}`, metadata: any, localName: string) {
    const onboardingSessionClient = await loginAsOnboardingUser(address)
    const { uri: _uri } = await storageClient.uploadAsJson(metadata)
    console.log('uploaded uri=>', _uri);

    const result = await createAccountWithUsername(onboardingSessionClient!, {
        username: { localName },
        metadataUri: uri(_uri),
    })
        .andThen(handleWith(walletClient))
    return result
}

export async function loginAsAccountOwner(account_address: `0x${string}`, user_address: `0x${string}`, fn?: () => void) {
    const authenticated = await client.login({
        accountOwner: {
            account: account_address,
            app: app_address,
            owner: user_address,
        },
        signMessage: (message) => signMessage(config, { message }),
    });

    if (authenticated.isErr()) {
        return console.error(authenticated.error);
    }

    const sessionClient = authenticated.value
    localStorage.setItem('lens_account', account_address)
    fn && fn()
    return sessionClient
}

export async function loginAsAccountManager(account_address: `0x${string}`) {
    const sessionClient = await getSession()
    const result = await addAccountManager(sessionClient!, {
        address: evmAddress(account_address),
        permissions: {
            canExecuteTransactions: true,
            canTransferTokens: false,
            canTransferNative: false,
            canSetMetadataUri: true,
        }
    })
    return result
}

export async function getSession() {
    const resumed = await client.resumeSession()
    if (resumed.isErr()) {
        return console.error(resumed.error);
    }
    const sessionClient = resumed.value
    return sessionClient
}

export async function changeAuth(account_address: `0x${string}`) {
    const query = `
  mutation {
    switchAccount(request: { account: ${account_address} }) {
      ... on AuthenticationTokens {
        accessToken
        refreshToken
        idToken
      }

      ... on ForbiddenError {
        reason
      }
    }
  }
`

    const result = await sendGraphQLQuery(query)
    return result

    // const url = 'https://api.testnet.lens.dev/graphql'
    // const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ query }),
    // });

    // const data = await response.json();

    // console.log('switchAccountMutation result=>', data);

}

export async function enable_Signless() {
    const sessionClient = await getSession()
    const result: any = await enableSignless(sessionClient!)

    if (result.isErr()) {
        return console.error(result.error)
    }

    const hash = await sendEip712Transaction(walletClient, {
        data: result.value.raw.data,
        gas: BigInt(result.value.raw.gasLimit),
        maxFeePerGas: BigInt(result.value.raw.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(result.value.raw.maxPriorityFeePerGas),
        nonce: result.value.raw.nonce,
        paymaster: result.value.raw.customData.paymasterParams?.paymaster,
        paymasterInput:
            result.value.raw.customData.paymasterParams?.paymasterInput,
        to: result.value.raw.to,
        value: BigInt(result.value.raw.value),
    })
    console.log('hash=>', hash);
}

export async function checkAuthStatus() {
    const sessionClient = await getSession()
    const result = await sessionClient!.getAuthenticatedUser()
    console.log('auth status=', result)
    return result
}




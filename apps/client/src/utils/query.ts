export async function sendGraphQLQuery(query: string) {
    const url = 'https://api.testnet.lens.dev/graphql'
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();

    return data

}
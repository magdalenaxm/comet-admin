import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StoryContext, StoryFn } from "@storybook/addons/dist/types";
import { RestLink } from "apollo-link-rest";
import * as React from "react";

export function apolloStoryDecorator<StoryFnReturnType = unknown>(options?: { uri?: string; responseTransformer?: RestLink.ResponseTransformer }) {
    return (fn: StoryFn<StoryFnReturnType>, c: StoryContext) => {
        const link = ApolloLink.from([
            new RestLink({
                uri: options?.uri || "https://jsonplaceholder.typicode.com/",
                responseTransformer: options?.responseTransformer,
            }),
        ]);

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            link,
            cache,
        });

        return <ApolloProvider client={client}>{fn()}</ApolloProvider>;
    };
}

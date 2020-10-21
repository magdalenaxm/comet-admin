import { useQuery } from "@apollo/react-hooks";
import { Box, Card, CircularProgress, Typography } from "@material-ui/core";
import { ApolloError } from "apollo-client";
import { DocumentNode } from "graphql";
import * as React from "react";
import styled from "styled-components";

interface IProps {
    phantom?: boolean;
    selectedId?: string;
    rows?: Array<{ id: string | number }>;
    query?: DocumentNode;
    dataAccessor?: string;
    children: (data: any, options: { phantom: boolean }) => React.ReactNode;
    components?: {
        error?: React.ComponentType<{ error: ApolloError }>;
    };
}
const ProgressContainer = styled.div`
    padding-top: 30px;
    display: flex;
    justify-content: center;
`;

export function Selected(props: IProps) {
    const ErrorComponent = props.components?.error;
    let row;
    if (props.rows) {
        row = props.rows.find(i => String(i.id) === String(props.selectedId)); // compare as strings as selectedId might come from url
    }
    const queryResult = props.query ? useQuery(props.query, { variables: { id: props.selectedId } }) : undefined;

    if (!props.phantom && !row) {
        if (!props.query || !queryResult) {
            return null;
        }
        if (queryResult.error) {
            return ErrorComponent !== undefined ? (
                <ErrorComponent error={queryResult.error} />
            ) : (
                <Card>
                    <Box padding={4}>
                        <Typography>Error :( {queryResult.error.toString()}</Typography>
                    </Box>
                </Card>
            );
        }
        if (queryResult.loading || !queryResult.data) {
            return (
                <ProgressContainer>
                    <CircularProgress />
                </ProgressContainer>
            );
        }
        if (!props.dataAccessor) {
            throw new Error("dataChild prop is required");
        }
        return <>{props.children(queryResult.data[props.dataAccessor], { phantom: false })}</>;
    } else {
        return <>{props.children(row, { phantom: !!props.phantom })}</>;
    }
}

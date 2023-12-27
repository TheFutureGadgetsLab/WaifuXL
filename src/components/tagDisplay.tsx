import { useAppStateStore, useImageStore } from "@/services/useState";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Pagination } from "@mui/material";
import React, { useState } from "react";

interface tagDisplayTypes {
    title: string,
    index: string
}

interface xTypes {
    0: string,
    1: number
}
export function TagDisplayComponent({ title, index }: tagDisplayTypes) {
    let { tags } = useImageStore();
    const [tagPage, setTagPage] = useState(1)
    tags = tags[index]
    const curTags = tags.slice(5 * (tagPage - 1), 5 * (tagPage))
    const maxTagPage = Math.ceil(tags.length / 5)

    return (
        <>
            <Typography align='center' sx={{fontWeight: 'bold', marginTop: 2 }}>
                {title}
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {curTags
                    .map(
                        (x: xTypes) =>
                            <>
                                <ListItem key={x[0]} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {`${truncateString(x[0])} - ${truncateNumber(x[1])}%`}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" variant="middle"/>
                            </>
                    )}
            </List>
            <Pagination hidden={index == "rating"} count={maxTagPage} boundaryCount={0} page={tagPage} onChange={
                (_event: React.ChangeEvent<unknown>, value: number) =>
                    setTagPage(value)}
            />
            <Divider sx={{marginTop: 2}} variant="fullWidth"/>
        </>
    )
}

function titleCase(str: string) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase()
    })
}

function truncateString(str: string) {
    str = cleanStringRemoveParen(str)
    return str.length > 13 ? str.slice(0, 13) + '…' : str
}

function truncateNumber(dig: number) {
    let str = (dig * 100).toString()
    str = cleanStringRemoveParen(str)
    return str.length > 5 ? str.slice(0, 5) : str
}

function cleanStringRemoveParen(str: string) {
    return titleCase(str.split('(')[0].replace(/_/g, ' '))
}

function cleanString(str: string) {
    return titleCase(str.replace(/_/g, ' '))
}

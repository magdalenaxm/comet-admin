import { CssBaseline, Grid, IconButton, Theme, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { Header } from "./MasterLayout.sc";
import { MenuContext } from "./menu/Context";

export interface IMasterLayoutProps extends WithStyles<typeof styles> {
    children: React.ReactNode;
    menuComponent: React.ComponentType;
    headerComponent?: React.ComponentType;
    hideToolbarMenuIcon?: boolean;
    openStateApi?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

function MasterLayout(props: IMasterLayoutProps) {
    const { classes, children, menuComponent: Menu, headerComponent: HeaderComponent, hideToolbarMenuIcon } = props;
    const internalOpenStateApi = React.useState(true);
    const [open, setOpen] = props.openStateApi || internalOpenStateApi;

    const toggleOpen = React.useCallback(() => {
        setOpen((s) => !s);
    }, [setOpen]);

    return (
        <MenuContext.Provider
            value={{
                open,
                toggleOpen,
            }}
        >
            <Grid container wrap="nowrap">
                <CssBaseline />
                <Header position="fixed" className={classes.appBar} color="inherit">
                    <Toolbar disableGutters={true}>
                        {!hideToolbarMenuIcon && (
                            <IconButton color="primary" onClick={toggleOpen}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        {HeaderComponent && <HeaderComponent />}
                    </Toolbar>
                </Header>
                <Menu />
                <Grid container component="main" wrap="nowrap" direction="column" alignItems="stretch" className={classes.grid}>
                    <Toolbar />
                    {children}
                </Grid>
            </Grid>
        </MenuContext.Provider>
    );
}

const styles = (theme: Theme) =>
    createStyles({
        appBar: {
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        grid: {
            padding: "0 30px",
        },
    });

const ExtendedMasterLayout = withStyles(styles)(MasterLayout);
export { ExtendedMasterLayout as MasterLayout };

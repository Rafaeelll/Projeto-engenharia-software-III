import React from "react";

export default function Teste(){
    return(
        <>
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <MainMenu />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Stream Advisor
                    </Typography>
                        <Button color="inherit" component={Link} to="/login">Log out</Button>
                    </Toolbar>
                </AppBar>
            </Box> 
        </div>
        </>
    
    )
}
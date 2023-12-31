import {List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";


const InboxFilterButtons = ({setSearchTerm, resetList}) =>{



    const stagesColor = {
        "ALL": "#a8e6cf",
        "DECLINED": "#f8c6d1",
        "SIGNED": "#88d8b0",
        "ATTENTION": "#ffccaa",
        "UNREAD": "#87ceeb"
    }



    const handleFilter = (filter) => {
       if(filter === "ALL"){
              setSearchTerm("");
              resetList(true);
              return;
       }
        console.log(filter);
        setSearchTerm(filter);
         resetList(true);
    }

    return(
        <List sx = {{display:"flex", flexDirection:"row",
            alignItems:"center", justifyContent: "center",
            width:"100%",
        }}>
            {['ALL', 'UNREAD', 'SIGNED','ATTENTION', 'DECLINED'].map((text, index) => (
                <ListItem key={text}>
                    <ListItemButton
                        onClick={() => handleFilter(text)}
                        sx={{backdropFilter: 'blur(25px)',
                            backgroundColor: "white",
                            "&:hover, &:focus, &:active": {
                                backgroundColor: stagesColor[text],
                            },
                            border: "1px solid black",
                            borderRadius: "25px",
                            textAlign:"center",
                            height:"40px"

                        }}
                    >
                        <ListItemText>
                            <Typography sx={{ fontSize: '14px' }}>
                                {text}
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )

}
export default InboxFilterButtons;
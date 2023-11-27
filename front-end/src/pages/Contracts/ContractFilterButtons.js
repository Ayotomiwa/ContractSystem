import {List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";


const ContractFilterButtons = ({setSearchTerm, resetList}) =>{


    const softColors = [

        '#a8e6cf',

        '#a7c7e7',
        '#f8c6d1',
        '#d1c4e9',
        '#88d8b0',
        '#ffccaa',
        '#87ceeb',

        '#f6e8b1',

        '#f3e5f5',
        '#fffdd0'
    ];


   const handleFilter = (filter) => {
       if(filter === "ALL"){
              setSearchTerm("");
              resetList(true);
              return;
       }
        setSearchTerm(filter);
         resetList(true);
    }

    return(
        <List sx = {{display:"flex", flexDirection:"row",
            alignItems:"center", justifyContent: "center",
            width:"100%",
        }}>
            {['ALL', 'DRAFT', 'EXPIRED', 'REVIEWED', 'SIGNED', 'ATTENTION', 'SENT'].map((text, index) => (
                <ListItem key={text}>
                    <ListItemButton
                        onClick={() => handleFilter(text)}
                        sx={{backdropFilter: 'blur(25px)',
                            backgroundColor: softColors[index],
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
export default ContractFilterButtons;
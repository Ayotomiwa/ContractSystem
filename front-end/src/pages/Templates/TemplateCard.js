import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {Link as RouterLink, useNavigate} from "react-router-dom";


export default function TemplateCard({ title, description, image, color, contractId, setContractId, setColor }) {


    const navigate = useNavigate();



    return (
        <Card elevation={8} sx={{ maxWidth: 250, mb: 4,
            backgroundColor:color,
            elevation: 6,
            border:"0.5px solid black",
            borderRadius:"12px"}}>
            <CardActionArea
                onClick={() => {
                    // navigate(`/contract/edit?contractId=${contractId}&color=${color}&default=${true}`)
                    window.location.href = `/contract/edit?contractId=${contractId}&color=${encodeURIComponent(color)}&default=${true}`;
                }}
            // sx={{backdropFilter: 'blur(25px)',
            //     // backgroundColor: 'rgba(255,255,255,0.47)'}}
            // backgroundColor: 'rgba(255,255,255,0.47)',
            //     "&:hover, &:active, &:focus": {
            //         backdropFilter:"",
            //         backgroundColor: "rgb(99, 102, 241, 0.03)"
            //     }
            // }}
            >
                {/*<CardMedia*/}
                {/*    component="img"*/}
                {/*    height="140"*/}
                {/*    image={image || "/assets/avatars/avatar-alcides-antonio.png"}*/}
                {/*    alt={title}*/}
                {/*/>*/}
                <CardContent sx={{ height:"250px"}}>
                    <Typography gutterBottom variant="h5" component="div"
                                // sx={{color:"rgb(185,67,102)"}}
                    >
                        {title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {description || "Default description if not provided"}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small"
                        variant="custom"
                        onClick={() => {
                            setContractId(contractId)
                            setColor(color)
                        }}
                        sx={{color: "black", border:"1px solid black"}}>
                    Preview
                </Button>
            </CardActions>
        </Card>

    );
}

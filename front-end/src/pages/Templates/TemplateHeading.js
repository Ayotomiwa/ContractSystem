import {useEffect, useRef} from "react";
import {Box, Typography} from "@mui/material";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";



const TemplateHeading = () => {
    const h1Ref = useRef(null);
    let interval = null;


    useEffect(()=>{
     handleMouseOver()
    },[])


    const handleMouseOver = () => {
        let iteration = 0;

        clearInterval(interval);

        interval = setInterval(() => {
            if (!h1Ref.current) {
                clearInterval(interval);
                return;
            }

            h1Ref.current.innerText = h1Ref.current.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return h1Ref.current.dataset.value[index];
                    }

                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= h1Ref.current.dataset.value.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 10);
    };

    return (

        <Box
            sx={{
                // display:"grid",
                // place:"center",
                width:"400px",
                margin:"auto",
            }}
        >
            <Typography
                ref={h1Ref}
                onMouseOver={handleMouseOver}
                data-value="Choose a template to get started or preview."
                textAlign="center"
                wordWrap="break-word"
                        className="templateHeading"
            >
                Choose a template to get started or preview.
            </Typography>
        </Box>
    );
};

export default TemplateHeading;

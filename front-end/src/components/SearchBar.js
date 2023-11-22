import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {Button,InputAdornment, OutlinedInput, SvgIcon} from "@mui/material";
import {useState} from "react";


export const SearchBar = ({setSearchTerm, resetList}) => {
    const [searchTermHolder, setSearchTermHolder] = useState("")

const handleSearch = (event) => {
    event.preventDefault();
    if(event.target.value === ""){
        return;
    }
    resetList(true);
    setSearchTerm(searchTermHolder);
    console.log("searching");
};

const handleInputChange= (event) => {
    event.preventDefault();
    if (event.target.value === ""){
        // setExams([]);
        // fetchExamsData();
        resetList(false);
        return
    }
    setSearchTermHolder(event.target.value);
    console.log(searchTermHolder);
};



return (
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Client"
      // handleInputChange={handleInputChange}
      onChange={handleInputChange}
      endAdornment={(
        <InputAdornment position="end">
          <Button
              onClick={handleSearch}
          >
              <SvgIcon
                  fontSize="large"
                  // sx={{color:"rgb(99, 102, 241)"}}
                  sx={{color:"#e75480"}}
              >
                  <MagnifyingGlassIcon />
              </SvgIcon>
          </Button>
        </InputAdornment>
      )}
      sx={{ maxWidth: "500px",backgroundColor:"rgb(59, 61, 145, 0.1)", borderRadius: "12px",
          border: "1px solid rgb(59, 61, 145)",
          "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
          }
      }}
    />
);
}



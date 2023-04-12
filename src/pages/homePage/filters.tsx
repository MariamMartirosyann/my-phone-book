import { Box, Grid, ButtonGroup, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import InputField from "../../shared/TextInput";



const Filters = ({ onChange }: { onChange: () => void }) => {
  const { reset } = useFormContext();

 
  const handleClear = () => {
    reset();
    onChange();
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={3}>
          <InputField name="search" label={"Search"} />
        </Grid>
       

        <Grid item xs={3}>
          <ButtonGroup variant="contained">
            <Button onClick={onChange} color="primary" variant="contained">
              Apply
            </Button>
            <Button onClick={handleClear} color="inherit">
              Clear
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;

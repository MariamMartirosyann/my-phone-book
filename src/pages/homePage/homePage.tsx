import { useState } from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import BasicModal from "../../shared/Modal/BasicModal";
import { IContact, IEmail, INumber } from "../../app/intrefaces";
import AddEditContact from "../contact/AddEditContact";
import BasicTable from "../../shared/Table";
import {
  columns,
  removeContactWarningConfig,
} from "../../shared/Table/columns";
import { useDispatch, useSelector } from "react-redux";
import { deleteContact, selectContact } from "../../app/store/ContactSlice";
import ContactDetail from "../contact/ContactDetail";
import SharedDialog from "../../shared/Dialog";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";

const useStyles: any = makeStyles({
  main: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(#3f50b5, #9198e5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    width: "55%",
    height: "80%",
    background: "white",
    padding: "10px",
  },
  btn: {
    marginRight: "20px",
  },

  center: {
    width: "100%",
    textAlign: "center",
    marginBottom: "50px",
    marginTop: "10px",
  },
  end: {
    width: "90%",
    textAlign: "end",
    marginBottom: "50px",
  },
});

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm({});

  let contactData = useSelector(selectContact);
  const [value, setValue] = useState<string | " ">("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeContact, setActiveContact] = useState<IContact>();
  const [isWarningOpen, setWarningOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const handleOpenModal = () => setOpenModal(true);

  const handleClose = () => {
    setActiveContact(undefined);
  };

  const onFormSuccess = () => {
    setActiveContact(undefined);
    setOpenModal(false);
  };
  const handleEdit = (row: IContact) => {
    setActiveContact(row);
    setOpenModal(true);
  };

  const handleView = (row: IContact) => {
    setActiveContact(row);
    setViewModalOpen(true);
  };

  const handleOpenWarning = (row: IContact) => {
    setActiveContact(row);
    setWarningOpen(true);
  };

  const filterNameData = contactData.filter((i: IContact) =>
    i.name.toLowerCase().includes(value)
  );

  const filterNumberData = () => {
    const a = contactData.filter((i: IContact) => {
      const b = i.number.some((i: INumber) =>
        i.value.toString().includes(value)
      );
      return b;
    });
    return a;
  };

  const filterEmailData = () => {
    const a = contactData.filter((i: IContact) => {
      const b = i.email.some((i: IEmail) => i.value.toString().includes(value));
      return b;
    });
    return a;
  };

  const filterData = [
    ...filterNameData,
    ...filterNumberData(),
    ...filterEmailData(),
  ];

  const handleClear = () => {
    setValue("");
  };

  const handleDelete = () => {
    dispatch(deleteContact(activeContact));
    toast.success("Contact deleted");
  };

  const getActions = (rowData: IContact) => {
    return [
      {
        label: "View",
        onClick: () => handleView(rowData),
      },

      {
        label: "Edit",
        onClick: () => handleEdit(rowData),
      },

      {
        label: "Delete",
        onClick: () => handleOpenWarning(rowData),
      },
    ];
  };

  return (
    <Box className={classes.main}>
      <Box component={Paper} className={classes.table} elevation={10}>
        <Box className={classes.center}>
          {" "}
          <Typography variant="h4" color="primary">
            Mariam Phone Book App
          </Typography>
        </Box>
        <Box mt={2} ml={10}>
          <FormProvider {...methods}>
            <Box mt={2} mb={2} ml={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <TextField
                      name="Search"
                      size="small"
                      className="searchBar"
                      label="Search"
                      onChange={(e) => setValue(e.target.value)}
                    ></TextField>
                  </Grid>

                  <Grid item xs={3}>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={handleClear}
                      color="primary"
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </FormProvider>

        </Box>
        <Box className={classes.end}>
          <Button
            onClick={handleOpenModal}
            variant="outlined"
            endIcon={<AddIcon />}
            size="small"
          >
            Add Contact
          </Button>
        </Box>
        <BasicModal
          open={openModal}
          setOpen={setOpenModal}
          onClose={handleClose}
          title={`${activeContact ? "Edit" : "Add"} Contact`}
        >
          <AddEditContact onSuccess={onFormSuccess} editData={activeContact} />
        </BasicModal>

        <Box sx={{ width: "80%", justifyContent: "center", margin: "auto" }}>
          {" "}
          {!!value ? (
            <BasicTable<IContact>
              data={filterData}
              columns={columns}
              getActions={getActions}
              filterOptions={{
                reset: methods.reset,
                watch: methods.watch,
              }}
            />
          ) : (
            <BasicTable<IContact>
              data={contactData}
              columns={columns}
              getActions={getActions}
              filterOptions={{
                reset: methods.reset,
                watch: methods.watch,
              }}
            />
          )}
          <BasicModal
            open={isViewModalOpen}
            setOpen={setViewModalOpen}
            onClose={handleClose}
            title={`View Contact`}
          >
            <ContactDetail data={activeContact} />
          </BasicModal>
          <SharedDialog
            open={isWarningOpen}
            setOpen={setWarningOpen}
            onSuccess={handleDelete}
            textConfig={removeContactWarningConfig}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

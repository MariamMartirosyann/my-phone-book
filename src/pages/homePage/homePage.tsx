import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import { Button, Paper, TextField, Typography, Box } from "@mui/material";
import BasicModal from "../../shared/Modal/BasicModal";
import { IContact, IEmail, INumber } from "../../app/intrefaces";
import AddEditContact from "../contact/AddEditContact";
import BasicTable from "../../shared/Table";
import {
  columns,
  columnsSmall,
  removeContactWarningConfig,
} from "../../shared/Table/columns";
import { deleteContact, selectContact } from "../../app/store/ContactSlice";
import ContactDetail from "../contact/ContactDetail";
import SharedDialog from "../../shared/Dialog";

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
    height: "80%",
    background: "white",
    padding: "10px",
    overflowY: "scroll",
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

  const isBigScreen = useMediaQuery({ query: "(min-width: 1400px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 670px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 370px)" });

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
      <Box
        component={Paper}
        className={classes.table}
        elevation={10}
        width={isBigScreen ? "55%" : "80%"}
      >
        <Box className={classes.center}>
          {" "}
          <Typography variant="h4" color="primary">
            Phone Book
          </Typography>
        </Box>
        <Box sx={{ margin: "20px" }}>
          <FormProvider {...methods}>
            <TextField
              name="Search"
              size="small"
              className="searchBar"
              label="Search"
              onChange={(e) => setValue(e.target.value)}
              sx={{ width: !isMediumScreen ? "90%" : null }}
            />

            <Button
              variant="outlined"
              size="medium"
              onClick={handleClear}
              color="primary"
              sx={{
                margin: isMediumScreen ? " 2px 0 0 20px" : "10px 0",
                width: !isMediumScreen ? "90%" : null,
              }}
            >
              Clear
            </Button>
          </FormProvider>
        
        </Box>

        <Box sx={{ margin:"20px", textAlign:!isMediumScreen? null: "end", }}>
          <Button
            onClick={handleOpenModal}
            variant="outlined"
            endIcon={<AddIcon />}
            size="small"
            sx={{
              margin: isMediumScreen ? " 2px 0 0 20px" : "10px 0",
              width: !isMediumScreen ? "90%" : null,
            
            }}
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

        <Box sx={{ margin:!isSmallScreen ? "20px" : null }}>
          {" "}
          {!!value ? (
            <BasicTable<IContact>
              data={filterData}
              columns={isMediumScreen ? columns : columnsSmall}
              getActions={getActions}
              filterOptions={{
                reset: methods.reset,
                watch: methods.watch,
              }}
            />
          ) : (
            <BasicTable<IContact>
              data={contactData}
              columns={isMediumScreen ? columns : columnsSmall}
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

import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { addContact, updateContact } from "../../app/store/ContactSlice";
import { IContact, IEmail, IFormData, INumber } from "../../app/intrefaces";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import ButtonLoader from "../../shared/ButtonLoader";
import InputField from "../../shared/TextInput";
import { emailRule, phoneNumberRegex, requiredRules } from "../../validators";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getBase64 } from "../../shared/constants";
import {
  UploadResult,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../../firebase";

const useStyles: any = makeStyles({
  imgWrapper: {
    width: 200,
    // height: 200,
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },
  },

  error: {
    marginLeft: "13px",
  },
});

const emailDefaultValue: IEmail = {
  id: nanoid(),
  value: "",
};
const numberDefaultValue: INumber = {
  id: nanoid(),
  value: 0,
};

interface IAddEditContactProps {
  onSuccess: () => void;
  editData?: IContact;
}

const AddEditContact = ({ onSuccess, editData }: IAddEditContactProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const fileInputRef = useRef<any>(null);

  const [firebaseUrl, setFirebaseUrl] = useState<string>();
  const [editDataState, setEditDataState] = useState<
    IContact | null | undefined
  >(editData || null);

  const methods = useForm<IFormData>({
    mode: "all",
    defaultValues: {
      name: "",
      email: [emailDefaultValue],
      number: [numberDefaultValue],
      photo: "",
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const photoUrlWatch = useWatch({
    control: methods.control,
    name: "photo",
  });

  const emailFieldValue = useFieldArray({
    control,
    name: "email",
  });

  const numberFieldValue = useFieldArray({
    control,
    name: "number",
  });

  const handleAddEmail = () => {
    if (editData) {
      emailFieldValue.append({ id: Date.now(), value: "" });
    } else {
      emailFieldValue.append(emailDefaultValue);
    }
  };

  const handleAddNumber = () => {
    if (editData) {
      numberFieldValue.append({ id: Date.now(), value: 0 });
    } else {
      numberFieldValue.append(numberDefaultValue);
    }
  };

  const handleRemoveEmail = (index: any) => {
    emailFieldValue.remove(index);
  };

  const handleRemoveNumber = (index: any) => {
    numberFieldValue.remove(index);
  };

  const triggerFileUpload = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    const base64: any = await getBase64(file);
    methods.setValue("photo", base64);
    methods.setValue("photoFile", file);
    methods.clearErrors("photo");
    e.target.value = "";
    editDataState && setEditDataState({ ...editDataState, photo: "" });
  };

  const uploadToFirebase = async (file: File): Promise<UploadResult> => {
    const storage = getStorage(app);
    const storageRef = ref(storage, file.name);

    try {
      const uploadTask = await uploadBytes(storageRef, file);
      if (!uploadTask) {
        toast.success("Something went wrong with uploading image");
        throw console.error("Something went wrong with uploading image");
      }
      return uploadTask;
    } catch (e) {
      throw e;
    }
  };

  const downloadFromFirebase = async (name: string) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, name);
    const url = await getDownloadURL(storageRef);
    setFirebaseUrl(url);
  };

  const onSubmit = async (formData: IFormData) => {
    if (editData) {
      let photo = formData.photo;
      if (editData?.photo !== editDataState?.photo) {
        const {
          metadata: { name },
        } = await uploadToFirebase(formData.photoFile as File);
        photo = name;
      }
      const newFormData = {
        id: editData.id,
        name: formData.name,
        email: formData.email,
        number: formData.number,
        photo: photo,
      };
      dispatch(updateContact(newFormData));
      toast.success("Contact Updated Successfully");
    } else {
      const {
        metadata: { name },
      } = await uploadToFirebase(formData.photoFile as File);

      const newFormData = {
        name: formData.name,
        email: formData.email,
        number: formData.number,
        photo: name,
      };
      dispatch(addContact(newFormData));
      toast.success("Contact Added Successfully");
    }

    onSuccess();
  };

  const previewSrc = useMemo(
    () => (!editDataState?.photo ? photoUrlWatch : firebaseUrl),
    [editDataState?.photo, firebaseUrl, photoUrlWatch]
  );

  const showRemoveEmail = methods.watch().email.length > 1;
  const showRemoveNumber = methods.watch().number.length > 1;

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        email: editData.email,
        number: editData.number,
        photo: editData.photo,
      });

      downloadFromFirebase(editData.photo);
    }
  }, [editData, reset]);

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <InputField
                name={"name"}
                label="Name"
                customError={errors?.name?.message}
                rules={requiredRules}
              />
            </Grid>

            {numberFieldValue.fields?.map((i, index) => {
              //console.log(errors?.number?.[index]?.value?.message,"errors");
              return (
                <Grid
                  item
                  key={index}
                  xs={12}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <InputField
                    name={`number.${index}.value`}
                    label="Number"
                    customError={errors?.number?.[index]?.value?.message}
                    rules={{
                      ...requiredRules,
                      pattern: {
                        value: phoneNumberRegex,
                        message: "Enter only + or numbers, minimum 9 symbols",
                      },
                    }}
                  />
                  <Button
                   variant="outlined"
                    size="small"
                    onClick={handleAddNumber}
                    style={{ marginLeft: "5px" }}
                  >
                    <PlusIcon />
                  </Button>

                  {showRemoveNumber ? (
                    <Button
                    variant="outlined"
                      size="small"
                      style={{ marginLeft: "5px" }}
                      onClick={handleRemoveNumber}
                    >
                      <DeleteIcon />
                    </Button>
                  ) : null}
                </Grid>
              );
            })}

            {emailFieldValue.fields?.map((i, index) => {
              return (
                <Grid
                  key={index}
                  item
                  xs={12}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <InputField
                    key={index}
                    name={`email.${index}.value`}
                    label="Email"
                    customError={errors?.email?.[index]?.value?.message}
                    rules={{ ...requiredRules, ...emailRule }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddEmail}
                    style={{ marginLeft: "5px" }}
                  >
                    <PlusIcon />
                  </Button>
                  {showRemoveEmail ? (
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ marginLeft: "5px" }}
                      onClick={handleRemoveEmail}
                    >
                      <DeleteIcon />
                    </Button>
                  ) : null}
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <Box display="none">
                <Controller
                  name="photo"
                  control={methods.control}
                  rules={requiredRules}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={""}
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  )}
                />
              </Box>
              <Button
                variant="outlined"
                size="large"
                style={{ width: "200px", marginBottom: "15px" }}
                onClick={triggerFileUpload}
              >
                Add Photo
              </Button>
            </Grid>

            {methods.formState?.errors?.photo ? (
              <FormHelperText error className={classes.error}>
                {methods.formState?.errors?.photo?.message}
              </FormHelperText>
            ) : (
              ""
            )}
          </Grid>
          {photoUrlWatch ? (
            <Grid item xs={12} className={classes.imgWrapper}>
              <img src={previewSrc} alt="contact" />
            </Grid>
          ) : null}

          <Grid item xs={12} mt={2}>
            <ButtonLoader
              fullWidth
              variant="outlined"
              onClick={handleSubmit(onSubmit)}
              isLoading={false}
              type="submit"
            >
              <Typography>Save</Typography>
            </ButtonLoader>
          </Grid>
        </FormProvider>
      </form>
    </Fragment>
  );
};

export default AddEditContact;

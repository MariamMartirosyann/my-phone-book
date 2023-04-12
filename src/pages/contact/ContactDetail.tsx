import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import { IContact } from "../../app/intrefaces";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface IContactDetailProps {
  data?: IContact;
}

const ContactDetail = ({ data }: IContactDetailProps) => {
  const [firebaseUrl, setFirebaseUrl] = useState<string>();

  const downloadFromFirebase = async (name: string) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, name);
    const url = await getDownloadURL(storageRef);
    setFirebaseUrl(url);
  };

  useEffect(() => {
    downloadFromFirebase(data?.photo);
  }, [data]);

  return (
    <Card sx={{ maxWidth: 600, marginBottom:"40px"}}>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <CardMedia
          sx={{ width: 200, height: 200 }}
          image={firebaseUrl}
          title="contact"
        />
        <Box>
          {" "}
          <Typography gutterBottom variant="h5" component="div">
            {data?.name}
          </Typography>
          <Box mt={2}>
            {" "}
            <Typography variant="h6" component="div">
              Email:{" "}
            </Typography>
            <Typography gutterBottom fontSize={16} component="div">
              {data?.email?.map((i) => {
                return <li key={i.id}>{i.value}</li>;
              })}
            </Typography>
          </Box>
          <Box mt={2}>
          <Typography variant="h6" component="div">
            Email:{" "}
          </Typography>
          <Typography fontSize={16}>
            {data?.number?.map((i) => {
              return <li key={i.id}>{i.value}</li>;
            })}
          </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Typography fontSize={16}> Id: {data?.id}</Typography>
      </CardContent>
    </Card>

  );
};

export default ContactDetail;

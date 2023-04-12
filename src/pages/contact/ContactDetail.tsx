import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import { IContact } from "../../app/intrefaces";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import CircularProgress from "@mui/material/CircularProgress";

interface IContactDetailProps {
  data?: IContact;
}

const ContactDetail = ({ data }: IContactDetailProps) => {
  const isMediumScreen = useMediaQuery({ query: "(max-width: 600px)" });

  const [firebaseUrl, setFirebaseUrl] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const downloadFromFirebase = async (name: string) => {
    setLoading(true);
    const storage = getStorage(app);
    const storageRef = ref(storage, name);
    const url = await getDownloadURL(storageRef);
    setFirebaseUrl(url);
    setLoading(false);
  };

  useEffect(() => {
    downloadFromFirebase(data?.photo);
  }, [data]);

  return (
    <Card sx={{ maxWidth: 800, marginBottom: "40px" }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {data?.name}
      </Typography>
      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: isMediumScreen ? "column" : "row",
          justifyContent: "space-around",
          alignItems: isMediumScreen ? "center" : null,
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CardMedia
            sx={{
              width: !isMediumScreen ? 200 : 100,
              height: !isMediumScreen ? 200 : 100,
            }}
            image={firebaseUrl}
            title="contact"
          />
        )}

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box mt={2}>
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
              Number:{" "}
            </Typography>
            <Typography fontSize={16}>
              {data?.number?.map((i) => {
                return <li key={i.id}>{i.value}</li>;
              })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      {/* <CardContent>
        <Typography fontSize={16}> Id: {data?.id}</Typography>
      </CardContent> */}
    </Card>
  );
};

export default ContactDetail;

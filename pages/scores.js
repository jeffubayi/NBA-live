import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import "react-multi-carousel/lib/styles.css";
import GetLastNightScores from "../components/yesterdayscores";
import { setDateCookieClientSide } from "../util/cookies";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import styled from "styled-components";
import useMediaQuery from "@mui/material/useMediaQuery";
import Chip from "@mui/material/Chip";
import AdapterDateFns from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

const axios = require("axios");

const ourGray = "#FFFF";
const lightGray = "#E9E4E4";

const StyledDiv = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, auto);
  margin: 0.1rem;
`;

export default function Scores(props) {
  const [scores, setScores] = useState(props.yestScoresArray);
  const isSmallWindow = useMediaQuery(`(max-width:768px)`);
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
    .toISOString()
    .slice(0, 10);

  const yesterdayWithoutDashes = yesterday.replace(/-/g, "");

  const [date, setDate] = useState("");

  setDateCookieClientSide(date);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Head>
        <title>NBA | Scores</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            color: "white",
            padding: "10px",
            marginTop: "3rem",
          }}
        >
           {!isSmallWindow ? (
          <DesktopDatePicker
          variant="standard"
            label="Select Game Day"
            inputFormat="MM/DD/yyyy"
            value=""
            onChange={(newDate) => {
              console.log(
                "event == ",
                new Date(newDate).toISOString().slice(0, 10).replace(/-/g, "")
              );
              const newDateWithoutDashes = newDate._d
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
              setDate(newDateWithoutDashes);

              const options = {
                method: "GET",
                url: `https://data.nba.net/10s/prod/v2/${newDateWithoutDashes}/scoreboard.json`,
                params: {},
                headers: {},
              };
              axios
                .request(options)
                .then(function (response) {
                  const scoresArray = response.data.games;

                  return setScores(scoresArray);
                })
                .catch(function (error) {
                  console.error(error);
                });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          ):(
          <TextField
            id="date"
            label="Game scores on day:"
            onChange={(e) => {
              const newDate = e.target.value
              const newDateWithoutDashes = newDate.replace(/-/g, "")
              setDate(newDateWithoutDashes);

              const options = {
                method: "GET",
                url: `https://data.nba.net/10s/prod/v2/${newDateWithoutDashes}/scoreboard.json`,
                params: {},
                headers: {},
              };
              axios
                .request(options)
                .then(function (response) {
                  const scoresArray = response.data.games;

                  return setScores(scoresArray);
                })
                .catch(function (error) {
                  console.error(error);
                });
            }}
            type="date"
            defaultValue={today}
            sx={{ width: 350, borderRadius: "1rem", color: "white" }}
            InputLabelProps={{
              shrink: true,
            }}
            focused
            fullWidth
          />
          )}
        </div>

        {isSmallWindow ? (
          <StyledDiv>
            {scores.map((game) => (
              // Here we use div instead of li tag
              // because Carousel adds another li tag
              // by itself. If we set this tag to li,
              // it would cause the conflict.
              <Link href={`/${game.gameId}`}>
                <Card
                  style={{
                    margin: "1rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                  key={game.gameId}
                >
                  <div
                    style={{
                      justifyContent: "space-evenly",
                      display: "grid",
                      gap: "0.4rem",
                      gridTemplateColumns: "repeat(2,auto)",
                    }}
                  >
                    <Avatar
                      src={`/${game.vTeam.triCode}.png`}
                      alt="Image"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    />
                    <Avatar
                      src={`/${game.hTeam.triCode}.png`}
                      alt="Image"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    />
                  </div>
                  <CardContent>
                    <div
                      style={{
                        justifyContent: "space-evenly",
                        display: "grid",
                        gap: "0.4rem",
                        gridTemplateColumns: "repeat(3,auto)",
                      }}
                    >
                      <Typography gutterBottom variant="h7" component="div">
                        {game.vTeam.triCode}
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div">
                        vs
                      </Typography>
                      <Typography gutterBottom variant="h7" component="div">
                        {game.hTeam.triCode}
                      </Typography>
                    </div>
                    <div
                      style={{
                        justifyContent: "space-evenly",
                        display: "grid",
                        gap: "0.4rem",
                        gridTemplateColumns: "repeat(3,auto)",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {game.vTeam.score}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                      >
                        -
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {game.hTeam.score}
                      </Typography>
                    </div>
                    {game.period.current === 4 ? (
                      <div style={{ textAlign: "center" }}>
                        <Chip label="FINAL" />
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <Chip label={game.startTimeEastern} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </StyledDiv>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(3, auto)",
              margin: " 0.5rem",
            }}
          >
            {scores.map((game) => (
              // Here we use div instead of li tag
              // because Carousel adds another li tag
              // by itself. If we set this tag to li,
              // it would cause the conflict.
              <Link href={`/${game.gameId}`}>
                <Card
                  style={{
                    margin: "1rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                  key={game.gameId}
                >
                  <div
                    style={{
                      justifyContent: "space-evenly",
                      display: "grid",
                      gap: "0.4rem",
                      gridTemplateColumns: "repeat(2,auto)",
                    }}
                  >
                    <Avatar
                      src={`/${game.vTeam.triCode}.png`}
                      alt="Image"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    />
                    <Avatar
                      src={`/${game.hTeam.triCode}.png`}
                      alt="Image"
                      style={{ width: "3.5rem", height: "3.5rem" }}
                    />
                  </div>
                  <CardContent>
                    <div
                      style={{
                        justifyContent: "space-evenly",
                        display: "grid",
                        gap: "0.4rem",
                        gridTemplateColumns: "repeat(3,auto)",
                      }}
                    >
                      <Typography gutterBottom variant="h7" component="div">
                        {game.vTeam.triCode}
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div">
                        vs
                      </Typography>
                      <Typography gutterBottom variant="h7" component="div">
                        {game.hTeam.triCode}
                      </Typography>
                    </div>
                    <div
                      style={{
                        justifyContent: "space-evenly",
                        display: "grid",
                        gap: "0.4rem",
                        gridTemplateColumns: "repeat(3,auto)",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {game.vTeam.score}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="caption"
                        component="div"
                      >
                        -
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {game.hTeam.score}
                      </Typography>
                    </div>
                    {game.period.current === 4 ? (
                      <div style={{ textAlign: "center" }}>
                        <Chip label="FINAL" />
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <Chip label={game.startTimeEastern} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export async function getServerSideProps(context) {
  const { getSessionByToken, getUserByToken } = await import(
    "../util/database"
  );

  const session = await getSessionByToken(context.req.cookies.session);
  const userByToken = await getUserByToken(session);

  if (
    !session ||
    session.userId !== userByToken.userId ||
    userByToken === "undefined"
  ) {
    const yestScoresArray = await GetLastNightScores();
    return {
      props: {
        yestScoresArray: yestScoresArray || [],
      },
    };
  } else {
    const userId = userByToken.userId;

    const yestScoresArray = await GetLastNightScores();
    return {
      props: {
        yestScoresArray: yestScoresArray || [],
        userId: userId,
      },
    };
  }
}

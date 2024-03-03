import React from "react";
import Head from "next/head";
import { Box, Card, CardContent, Container, Grid } from "@mui/material";
import Link from "next/link";

const StoryBoards = () => {
  return (
    <>
      <Head>
        <title>Storyboards</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container>
          <Card sx={{ minWidth: 1200 }}>
            <CardContent>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <Link href="/storyboards/story-1" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/story-1.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Story-1</div>
                      </div>
                    </div>
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link href="/storyboards/story-2" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/story-2.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Story-2</div>
                      </div>
                    </div>
                  </Link>
                </Grid>

                <Grid item xs={6}>
                  <Link href="/storyboards/story-3" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/story-3.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Story-3</div>
                      </div>
                    </div>
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link href="/storyboards/story-5" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/story-5.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Provenance Story</div>
                      </div>
                    </div>
                  </Link>
                </Grid>

                <Grid item xs={6}>
                  <Link href="/storyboards/story-6" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/story-6.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Multivariate Story</div>
                      </div>
                    </div>
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link href="/storyboards/story-7" passHref>
                    <div className={styles.container}>
                      <img
                        src="/static/storyboards/ml-dashboard-story.png"
                        className={styles.image}
                      ></img>
                      <div className={styles.overlay}>
                        <div className={styles.text}>Dashboard & Story</div>
                      </div>
                    </div>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default StoryBoards;

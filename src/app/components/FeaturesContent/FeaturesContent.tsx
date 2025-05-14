import { Container, Stack, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";
import AddIcon from "@mui/icons-material/Add";
import FeaturesList from "./FeaturesList/FeaturesList";
import FeaturesAddDialog from "./FeaturesAddDialog/FeaturesAddDialog";
import FeaturesListSearchBar from "../UsersContent/UserListSearchBar/UserListSearchBar";

const FeaturesContent = () => {
  const [isFeaturesDialogOpen, setIsFeaturesDialogOpen] = useState(false);

  const openFeaturesDialog = () => {
    setIsFeaturesDialogOpen(true);
  };

  const closeFeaturesDialog = () => {
    setIsFeaturesDialogOpen(false);
  };

  return (
    <Fragment>
      <Container>
        <Stack spacing={4} marginTop={4} marginBottom={8}>
          <Typography variant="h5" textAlign="center">
            Features
          </Typography>
          <FeaturesListSearchBar />
          <FeaturesList />
        </Stack>
      </Container>
      <FeaturesAddDialog open={isFeaturesDialogOpen} handleClose={closeFeaturesDialog} />
      <FloatingActionButton handleClick={openFeaturesDialog}>
        <AddIcon />
      </FloatingActionButton>
    </Fragment>
  );
};

export default FeaturesContent;

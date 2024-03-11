import React, { useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/es/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/es/TextField/TextField";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import "./addAlbum.css";
import IconButton from "@material-ui/core/IconButton";
import { CloseOutlined } from "@material-ui/icons";

import { Divider } from "@material-ui/core";
import { AlbumService } from "../../data/services";

import { Typography } from "@material-ui/core/es";
import { showDialog } from "../../Store/actions";
import { connect } from "react-redux";


const AddAlbum = props => {
  let album = {
    album_id: "",
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    link: "",
    cover_image: "",
    venue_name: "",
    venue_location: ""
  };

  if (props.location.state !== undefined) {
    album = props.location.state.detail;
    // console.log(album);
  }

  const [open, isOpen] = useState(true);

  // const [success, isSucess] = useState(false);

  const [error, showError] = useState("");

  const [values, setValues] = useState(album);

  const [image, changeImage] = useState("");

  const closeDialog = () => {
    isOpen(false);
    props.history.push("/albums");
  };

  const handleInputChange = event => {
    // event.target.name(event.target.value);

    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    changeImage(values.cover_image);
  };

  const handleStartDateChange = event => {
    setValues({ ...values, start_date: event });
  };

  const handleEndDateChange = event => {
    setValues({ ...values, end_date: event });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // console.log(values);
    // console.log("Add Call", values);
    AlbumService.addAlbum(values).then(response => {
      handleResponse(response);
    });

  };

  const handleUpdate = event => {
    event.preventDefault();
    // console.log("Update Call", values);
    AlbumService.updateAlbum(values).then(response => {
      handleResponse(response);
    });
  };

  const handleResponse = response => {
    if (response.status === 0) {
      // isSucess(false);
      showError(response.message);
    } else {
      //alert(response.data.message);
      props.openDialog("Albums", response.message);
      // isSucess(true);
      closeDialog();
    }
  };

  const getDialogTitle = () => {
    return album.album_id === "" ? "Add new Album" : "Update Album";
  };

  const getActionButtons = () => {
    return album.album_id === "" ? (
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Button type={"submit"} color="secondary" onClick={() => handleSubmit}>
          Save & Add New
        </Button>

        <Button
          type={"submit"}
          color="secondary"
          variant={"contained"}
          onClick={() => handleSubmit}
        >
          Save
        </Button>
      </div>
    ) : (
        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <Button
            type={"submit"}
            color="secondary"
            variant={"contained"}
            onClick={() => handleUpdate}
          >
            Update
        </Button>
        </div>
      );
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={closeDialog}
        aria-labelledby="add-new-album"
      >
        <DialogTitle id="add-new-album" className={"dialogTitle"}>
          {getDialogTitle()}
          <IconButton onClick={() => closeDialog()}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            style={{ textAlign: "center" }}
          >
            <form
              onSubmit={album.album_id === "" ? handleSubmit : handleUpdate}
              autoComplete="on"
            >
              <TextField
                fullWidth={true}
                label="Event Name"
                name={"title"}
                value={values.title}
                required={true}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth={true}
                label="Description"
                name={"description"}
                value={values.description}
                required={true}
                multiline={true}
                rows={4}
                rowsMax={4}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              <div style={{ display: "flex" }}>
                <DatePicker
                  keyboard
                  style={{ marginRight: "10px" }}
                  margin={"normal"}
                  fullWidth={true}
                  value={values.start_date}
                  variant="outlined"
                  views={["year", "month", "day"]}
                  format="MM/dd/yyyy"
                  label="Start Date"
                  onChange={handleStartDateChange}
                  mask={value =>
                    // handle clearing outside if value can be changed outside of the component
                    value
                      ? [
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/
                      ]
                      : []
                  }
                />
                <DatePicker
                  keyboard
                  style={{ marginLeft: "10px" }}
                  margin={"normal"}
                  fullWidth={true}
                  value={values.end_date}
                  variant="outlined"
                  views={["year", "month", "day"]}
                  format="MM/dd/yyyy"
                  label="End Date"
                  onChange={handleEndDateChange}
                  mask={value =>
                    // handle clearing outside if value can be changed outside of the component
                    value
                      ? [
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/
                      ]
                      : []
                  }
                />
              </div>

              <TextField
                fullWidth={true}
                label="Album Link (Google Photos Link)"
                name={"link"}
                value={values.link}
                required={true}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth={true}
                label="Album Cover (Photo Link)"
                name={"cover_image"}
                value={values.cover_image}
                required={true}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />

              <img
                className={"thumbnailImage"}
                src={image}
                alt={"Album Cover"}
              />

              <div style={{ display: "flex" }}>
                <TextField
                  fullWidth={true}
                  label="Venue Name"
                  style={{ marginRight: "10px" }}
                  name={"venue_name"}
                  value={values.venue_name}
                  required={true}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth={true}
                  rows={3}
                  style={{ marginLeft: "10px" }}
                  multiline={true}
                  rowsMax={3}
                  label="Venue Address"
                  name={"venue_location"}
                  value={values.venue_location}
                  required={true}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <Divider />
              <Typography variant="body1" color="error">
                {error}
              </Typography>
              {getActionButtons()}
            </form>
          </MuiPickersUtilsProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    openDialog: (title, description) =>
      dispatch(
        showDialog({ open: true, title: title, description: description })
      )
  };
};
export default connect(
  null,
  mapDispatchToProps
)(AddAlbum);

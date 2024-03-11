import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { showDialog } from "../../Store/actions";
import { connect } from "react-redux";
import TextField from "@material-ui/core/es/TextField/TextField";
import Button from "@material-ui/core/es/Button";

const AddEOMDescription = props => {
  const [dialog, isOpen] = useState(true);

  const [values, setValues] = React.useState({
    description: ""
  });

  const closeDialog = () => {
    isOpen(false);
    props.history.push("/eom");
  };

  const getDialogTitle = () => {
    return "EOM Description";
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = event => {
    // console.log("Save Description", values);
    closeDialog();
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={isOpen}
        onClose={closeDialog}
      >
        <DialogTitle className={"dialogTitle"}>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth={true}
            label="Description"
            name={"description"}
            required={true}
            multiline={true}
            rows={4}
            rowsMax={4}
            onChange={handleChange("description")}
            margin="normal"
            variant="outlined"
          />
          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <Button
              type={"submit"}
              color="secondary"
              onClick={() => closeDialog()}
            >
              Cancle
            </Button>

            <Button
              type={"submit"}
              color="primary"
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </div>
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
)(AddEOMDescription);

import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import Chip from "@material-ui/core/Chip";
import { FormControl, InputLabel, LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    // maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (item, items, theme) => {
  return {
    fontWeight:
      items === null
        ? theme.typography.fontWeightRegular
        : items.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const MultipleSelect = ({
  isLoading = false,
  items = [],
  selectedItems = [],
  onChange,
  isMultiple = true,
  placeHolder = "Select",
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [sortedItems, setSelectedItems] = React.useState(selectedItems);

  useEffect(() => {
    // console.debug('effect', selectedItems);
    setSelectedItems(selectedItems);
  }, [selectedItems]);

  const handleChange = (event) => {
    if (isMultiple) {
      setSelectedItems(event.target.value);
      onChange(event.target.value);
    } else {
      // Convert the value to array.
      setSelectedItems([event.target.value]);
      onChange([event.target.value]);
    }
  };

  const handleDelete = (event) => {
    let oArr = sortedItems;
    let ind = oArr.indexOf(event);
    oArr.splice(ind, 1);
    setSelectedItems(oArr);
    // console.debug('oArr', oArr);
    onChange(oArr);
  };

  const getChip = (data) => {
    return (
      <Chip
        key={data.value}
        variant="outlined"
        onDelete={() => {
          handleDelete(data);
        }}
        label={data.label}
        className={classes.chip}
      />
    );
  };

  return (
    <div className={classes.root}>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel style={{ marginLeft: 12 }} htmlFor="select-multiple-chip">
          {placeHolder}
        </InputLabel>
        <Select
          disabled={isLoading}
          multiple={isMultiple}
          variant={"outlined"}
          fullWidth={true}
          value={sortedItems}
          onChange={handleChange}
          // input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {/* {console.debug("Selected", selected[0])} */}
              {isMultiple
                ? selected.map((value) => getChip(value))
                : getChip(selected[0])}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem
              key={item.value}
              value={item}
              style={getStyles(item, sortedItems, theme)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {isLoading && <LinearProgress />}
      </FormControl>
    </div>
  );
};
export default MultipleSelect;

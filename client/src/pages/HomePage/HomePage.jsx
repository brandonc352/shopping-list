import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox,
} from "@mui/material";
import { itemsData, headers } from "../../backendData/itemsData.js";
import HomeFoodGroupBlock from "../../components/blocks/HomeFoodGroupBlock.jsx";

import {
  transformItemsData,
  parsePricePerUnit,
  sortItems,
  getHeaderValueIndex,
} from "../pageHandlers/homePagehandlers.js";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState({
    key: headers[9],
    ascending: true,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [showGroup, setShowGroup] = useState(true); // Initially visible
  const toggleGroupVisibility = () => {
    setShowGroup(!showGroup);
  };

  const getHeaderValueIndex = (headers, headerKey) => {
    return headers.findIndex((header) => header === headerKey);
  };

  const [items, setItems] = useState(transformItemsData(itemsData));

  const handleRowClick = (event) => {
    // Check if the event target is the checkbox itself or a child of the checkbox
    if (
      event.target.tagName.toLowerCase() === "input" &&
      event.target.type === "checkbox"
    ) {
      return; // Exit the function early if the click was on the checkbox
    }

    event.stopPropagation(); // Stop propagation only if the click wasn't on the checkbox
    const target = event.target.closest("tr");
    const rowIndex = parseInt(target.getAttribute("data-index"), 10);
    const checkbox = target.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      handleCheckboxChange(rowIndex, checkbox.checked);
    }
  };

  useEffect(() => {
    const initialTotalPrice = items.reduce((acc, item) => {
      const priceIndex = getHeaderValueIndex(headers, "Price");
      return acc + (item.selected ? parseFloat(item[priceIndex]) : 0);
    }, 0);

    const initialTotalCount = items.filter((item) => item.selected).length;

    setTotalPrice(initialTotalPrice);
    setTotalCount(initialTotalCount);
  }, [items]);

  useEffect(() => {
    setItems(sortItems([...items], sorting));
  }, [sorting]);

  const applySorting = (key) => {
    if (sorting.key === key) {
      setSorting({ ...sorting, ascending: !sorting.ascending });
    } else {
      setSorting({ key, ascending: true });
    }
  };

  const handleCheckboxChange = (index, isChecked) => {
    console.log("handleCheckboxChange");
    setItems((prevItems) => {
      // Create a new array based on the previous state
      const updatedItems = [...prevItems];
      // Update the specific item's 'selected' property
      updatedItems[index].selected = isChecked;
      // Return the updated array
      return updatedItems;
    });
  };

  const handleHeaderCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setItems((prevItems) => {
      return prevItems.map((item) => ({
        ...item,
        selected: isChecked,
      }));
    });
  };

  const updateItemSelection = (itemId) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item[0] === itemId) {
          return { ...item, selected: false };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    const itemsString = JSON.stringify(items);
    localStorage.setItem("items", itemsString);
  }, [items]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error occurred: {error.message}</div>;
  }
  const anyItemSelected = items.some((item) => item.selected);

  return (
    <div>
      {/* <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <p>Total Selected Items: {totalCount}</p> */}
      {/* <button onClick={toggleGroupVisibility} id={"toggle-group-btn"}>
        {showGroup ? <ArrowForwardIos /> : <ArrowBackIosNewIcon />}
      </button> */}
      <Grid container spacing={12} id={"groceries"}>
        {showGroup ? (
          <Grid item xs={8} lg={8} id={"items-table"}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={anyItemSelected}
                        onChange={handleHeaderCheckboxChange}
                      />
                    </TableCell>
                    {headers.map((header, index) => {
                      if (header !== "id" && header !== "Item") {
                        return (
                          <TableCell key={index}>
                            <TableSortLabel
                              active={sorting.key === header}
                              direction={sorting.ascending ? "asc" : "desc"}
                              onClick={() => applySorting(header)}
                            >
                              {header}
                            </TableSortLabel>
                          </TableCell>
                        );
                      }
                      return null;
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow
                      className={items[index].selected ? "selected" : ""}
                      key={index}
                      data-index={index}
                      onClick={handleRowClick}
                      sx={{
                        "&:hover": {
                          backgroundColor: "lightgray",
                        },
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={items[index].selected}
                          onChange={(event) =>
                            handleCheckboxChange(index, event.target.checked)
                          }
                        />
                      </TableCell>

                      {headers
                        .filter((header) => header !== "id")
                        .map((header) => (
                          <TableCell
                            key={`${header}-${index}`}
                            className={header + "-cell"}
                          >
                            <span className={header + "-cell"}>
                              {row[getHeaderValueIndex(headers, header)] || ""}
                            </span>
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : null}
        <Grid item xs={4} smlg={4} id={"selected-items-block"}>
          {/* {!showGroup ? ( */}
          <HomeFoodGroupBlock
            selectedItems={items.filter((item) => item.selected)}
            updateItemSelection={updateItemSelection}
          />
          {/* ) : null} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

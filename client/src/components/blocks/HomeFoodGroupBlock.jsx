import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { motion, AnimatePresence } from "framer-motion";

const HomeFoodGroupBlock = ({
  selectedItems,
  removeItem,
  updateItemSelection,
}) => {
  // Function to group items by their food group
  const groupItemsByFoodGroup = (items) => {
    return items.reduce((groups, item) => {
      const foodGroup = item[3]; // Assuming index 3 is the food group
      if (!groups[foodGroup]) {
        groups[foodGroup] = [];
      }
      groups[foodGroup].push(item);
      return groups;
    }, {});
  };

  // State to hold total price and total count
  const [totals, setTotals] = useState({
    totalPrice: 0,
    totalCount: 0,
  });

  useEffect(() => {
    // Calculate total price and total count when selectedItems change
    const totalPrice = selectedItems.reduce((total, item) => {
      const price = parseFloat(item["9"]);
      return total + price;
    }, 0);

    const totalCount = selectedItems.length;

    // Update state with new totals
    setTotals({ totalPrice, totalCount });
  }, [selectedItems]);

  const groupedItems = groupItemsByFoodGroup(selectedItems);

  const handleRemoveItem = (itemToRemoveId) => {
    removeItem(itemToRemoveId);
  };

  const handleItemSelectionChange = (itemId, selected) => {
    updateItemSelection(itemId, selected);
  };

  return (
    <div>
      <p>Total ${totals.totalPrice.toFixed(2)}</p>
      <p>Items: {totals.totalCount}</p>
      {Object.entries(groupedItems).map(([foodGroup, items]) => {
        const totalFoodGroupPrice = items.reduce((total, item) => {
          const price = parseFloat(item["9"]);
          return total + price;
        }, 0);

        return (
          <div key={foodGroup} className="food-group">
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <h4>{foodGroup}</h4>
              </Grid>
              <Grid item xs={4} textAlign="right">
                <h4>${totalFoodGroupPrice.toFixed(2)}</h4>
              </Grid>
            </Grid>{" "}
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <AnimatePresence>
                    {items.map((item, index) => {
                      const truncatedTitle = item[1].substring(0, 46);
                      return (
                        <motion.tr
                          key={item[0]} // Assuming item[0] is unique
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.5, delay: 0.2 },
                            position: "relative", // Ensure it occupies space
                          }} // Add a slight delay before removing
                        >
                          <TableCell>{truncatedTitle}</TableCell>
                          <TableCell>
                            {parseFloat(item["9"]).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                handleItemSelectionChange(item[0]);
                              }}
                            >
                              <DeleteForeverIcon />
                            </button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      })}
    </div>
  );
};

export default HomeFoodGroupBlock;

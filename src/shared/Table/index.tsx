import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useMemo, useCallback } from "react";
import { UseFormReset, UseFormWatch } from "react-hook-form";

import { IColumn } from "./constants";

import DotsMenu from "../DotsMenu";

export interface IAction<T> {
  label: string;
  onClick: (row: T) => any;
}

export interface ITableProps<T> {
  columns: IColumn[];
  data?: T[];
  onChange?: () => void;
  getActions?: (row: T) => IAction<T>[];

  filterOptions?: {
    watch: UseFormWatch<any>;
    reset: UseFormReset<any>;
  };
}

const BasicTable = <T extends unknown>({
  columns,
  data,
  onChange,
  getActions,
  filterOptions,
}: ITableProps<T>): JSX.Element => {
  const handleClickAction = useCallback((action: IAction<T>, row: T) => {
    action.onClick(row);
  }, []);

  const getActionColumn = useCallback((): IColumn => {
    return {
      label: "Actions",
      layout: (row: T) => {
        const actions = getActions?.(row) || [];
        return (
          <DotsMenu<T>
            actions={actions}
            onActionClick={handleClickAction}
            row={row}
          />
        );
      },
    };
  }, [getActions, handleClickAction]);

  const columnsData = useMemo(() => {
    return [...columns, getActionColumn()];
  }, [columns, getActionColumn]);

  const generateColumns = useMemo(() => {
    return columnsData?.map((column, index) => {
      return (
        <TableCell key={index} align="left">
          {column?.label}
        </TableCell>
      );
    });
  }, [columnsData]);

  const generateSingleRow = (row: any) => {
    return columnsData?.map((column, index) => {
      if (column.layout) {
        return (
          <TableCell key={index} scope="row">
            {column.layout(row)}
          </TableCell>
        );
      } else {
        return (
          <TableCell key={index} scope="row">
            {column?.field ? row[column.field] : "-"}
          </TableCell>
        );
      }
    });
  };

  const generateSimpleRows = () => {
    return data?.map((row, rowIndex) => (
      <TableRow
        key={rowIndex}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        {generateSingleRow(row)}
      </TableRow>
    ));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth:250 }} aria-label="simple table">
          <TableHead>
            <TableRow>{generateColumns}</TableRow>
          </TableHead>
          <TableBody>{generateSimpleRows()}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BasicTable;

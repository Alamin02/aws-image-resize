import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Status({ status }) {
  const classes = useStyles();

  console.log(status);

  const columns = [
    { name: "Key", field: "imageKey" },
    { name: "Original Image", field: "mainUrl" },
    { name: "Status", field: "status" },
    { name: "Size", field: "size" },
    { name: "Processed Image", field: "processedUrl" },
  ];

  if (status.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {status.map((row) => (
            <TableRow key={row.imageKey}>
              {columns.map((col) => (
                <TableCell>{row[col.field] || "None"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Status;

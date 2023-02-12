import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    flex: "3",
    margin: "0 10rem",
    border: "1px solid #999",
    borderRadius: "1rem",
    display: "flex",
    flexDirection: "column",
  },
});

type TableTopProps = {
  children?: JSX.Element;
};

const TableTop = (props: TableTopProps) => {
  const classes = useStyles();

  return <div className={classes.container}>{props.children}</div>;
};

export default TableTop;

import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    flex: "1",
    margin: "5rem 10rem",
    marginTop: "2.5rem",
    border: "1px solid #999",
    borderRadius: "1rem",
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

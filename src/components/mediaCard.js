import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  root: {
    width: 200,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.image}
          title={props.title}
        />
        <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <Typography gutterBottom variant="h5" component="h2">{props.title}</Typography>
          <Typography gutterBottom variant="subtitle1" component="subtitle1">Seen {props.time_seen} ago.</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
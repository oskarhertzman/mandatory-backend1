import { makeStyles } from '@material-ui/core/styles';

//Colors
export const MainTheme = '#586d8e';
export const DotTheme = '#67c4c8';

//Themes
export const paperTheme = {
  paper: {
    width: '90vw',
    height: '90vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative'
  },
};

export const enterTheme = makeStyles({
  root: {
    color: MainTheme,
    '&:hover': {
      cursor: 'pointer',
    }
  }
})

export const inputTheme = makeStyles((theme) => ({
  message: {
  width: '100%',
  }
}));

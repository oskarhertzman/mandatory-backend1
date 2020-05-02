import { makeStyles } from '@material-ui/core/styles';


//Colors
export const MainTheme = '#913030';
export const SecondTheme = '#cccccc';

//Themes
export const paperTheme = {
  paper: {
    width: '80vw',
    height: '80vh',
    maxWidth: '400px',
    maxHeight: '700px',
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

  },
  button: {
    
  }
}));

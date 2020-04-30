import { makeStyles } from '@material-ui/core/styles';


export const MainTheme = '#913030';
export const SecondTheme = '#cccccc';

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

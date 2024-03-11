import CircularProgress from '@material-ui/core/es/CircularProgress/CircularProgress';

const CircularLoader = () =>{
    return <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
        <CircularProgress color="secondary" /> 
    </div>
}
export default CircularLoader;
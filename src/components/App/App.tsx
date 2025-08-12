
import {useState} from 'react';
import Menu from '../Menu/Menu'
import Graph3D from '../Graph3D/Graph3D';

export enum EPAGE {
  GRAPH3D,
  GRAPH2D,
  CALC,
}

const App:React.FC = () => {
    const [page, setPage] = useState<EPAGE>(EPAGE.GRAPH3D);

    return (<div>
        <Menu showPage = {setPage}/>
        {page === EPAGE.GRAPH3D && <Graph3D/>}
        
    </div>);
}

export default App;

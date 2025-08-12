import { EPAGE } from "../App/App";


type TMenu = {
    showPage: (page: EPAGE) => void;
}

const Menu: React.FC<TMenu> = ({ showPage }) => {
    return (
        <div>
            <button onClick={() => showPage(EPAGE.GRAPH3D)}>Graph3D</button>
            <button onClick={() => showPage(EPAGE.GRAPH2D)}>Graph2D</button>
            <button onClick={() => showPage(EPAGE.CALC)}>Calc</button>
        </div>
    );
};

export default Menu;
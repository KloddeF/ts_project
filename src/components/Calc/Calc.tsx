import React from 'react';
import {useRef} from 'react';

const Calc = () => {
    const aRef = useRef();
    const bRef = useRef();
    const cRef = useRef();

    const operatorHandler = () => {
        const calc = new Calc();
        const a = calc.getValue(aRef.current.value);
        const b = calc.getValue(bRef.current.value);
        const c =calc[operand](a,b);
        cRef.current.value = c.toString();
    }

    return (<div>
        <textarea ref={aRef}/>
        <textarea ref={bRef}/>
        <button onClick = {() => operatorHandler('add')}>+</button>
        <textarea ref={cRef}/>
    </div>)
}

export default Calc
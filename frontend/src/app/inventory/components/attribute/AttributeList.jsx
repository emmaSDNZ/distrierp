"use client"
import { useState, useEffect } from 'react';

const AttributeList = () => {
    
    const [attributes, setAttributes] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('http://127.0.0.1:8000/api_distrimed_inventario/attribute-name-values/');
                const data = await res.json();
                console.log("ATRIBUTOS VALORES", data);
                setAttributes(data)
                //Aca puedes agregar setAttributeNames(data.nombresAtributos) por ejemplo.
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    return (  <div>
        {attributes.map((e)=>(
            <div key={e.id}>
                <div>
                    Nombre Atributo: {e.name_attr.name_attr}
                </div>
                <div>
                    {e.values.map((e)=>(
                        <div key={e.id}>{e.value}</div>
                    ))}
                </div>
            </div>

        ))}
    </div>
    );s
};

export default AttributeList;
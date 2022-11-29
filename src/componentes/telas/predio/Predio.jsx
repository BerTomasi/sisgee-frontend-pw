import { useState, useEffect } from "react";
import PredioContext from "./PredioContext";
import Tabela from "./Tabela";
import Form from "./Form";

function Predio() {
    //mensagens de alerta
    const [alerta, setAlerta] = useState({ status: "", message: "" });

    //exibir lista de objetos
    const [listaObjetos, setListaObjetos] = useState([]);

    //saber se esta editando ou incluindo
    const [editar, setEditar] = useState(false);

    //representa o predio a ser editado
    const [objeto, setObjeto] = useState({codigo : "", nome : "", descricao : "", sigla : ""})

    //consulta -> exibir predios
    const recuperaPredios = async () => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios`)
            .then(Response => Response.json())
            .then(data => setListaObjetos(data))
            .catch(err => console.log('ERRO: ' + err))
    }

    //metodo remover
    const remover = async objeto => {
        if (window.confirm('Deseja remover este objeto?')) {
            try {
                await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios/${objeto.codigo}`,
                    { method: "DELETE" })
                    .then(response => response.json())
                    .then(json => setAlerta({ status: json.status, message: json.message }))
            } catch (err) {
                console.log('ERRO: ' + err);
            }
        }
    }

    //recuperar um predio
    const recuperar = async codigo => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/predios/${codigo}`)
            .then(Response => Response.json())
            .then(data => setObjeto(data))
            .catch(err => console.log('ERRO: ' + err))
    }

    //cadastro
    const acaoCadastrar = async e => {
        e.preventDefault();

        const metodo = editar ? "PUT" : "POST";

        try{

            await fetch (`${process.env.REACT_APP_ENDERECO_API}/predios`,
            {
                method : metodo,
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(objeto)
            })
            .then(response => response.json())
            .then(json => {
                setAlerta({status : json.status, message : json.message})
                setObjeto(json.objeto)

                if(!editar){
                    setEditar(true)
                }
            })
        }catch(err){
            console.log(err.message);
        }

        recuperaPredios();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({...objeto, [name] : value});
    }

    

    useEffect(() => {
        recuperaPredios();
    }, []);

    return (
        <PredioContext.Provider value={
            {
                alerta, setAlerta, 
                listaObjetos, setListaObjetos, 
                recuperaPredios, 
                remover,
                objeto, setObjeto,
                editar, setEditar,
                recuperar,
                acaoCadastrar,
                handleChange,
            }
        }>
            <Tabela/>
            <Form/>
        </PredioContext.Provider>

    )
}

export default Predio;
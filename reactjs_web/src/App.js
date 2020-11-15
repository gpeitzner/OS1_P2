import './App.css';

import React, { Component } from 'react'
import PrimerReporte from './graficas/PrimerReporte.js'
import HorizontalBarExample from "./graficas/CuartoReporte.js";
import { HorizontalBar } from 'react-chartjs-2';
import axios from 'axios';

export default class App extends Component {
  
  state={
    primer_reporte:false,
    segundo_reporte:false,
    tercer_reporte:false,
    cuarto_reporte:false,
    last_item:"",
    data_primer_reporte:[],
    data_segundo_reporte:[],
    data_cuarto_reporte:{},
  }

  async getDataAxios(){
      const response = await axios.get("http://localhost:8081/");
      this.setState({last_item:response.data});
      console.log(response.data);
  }

  async getPrimerReporte(){
    let response = await axios.get("http://localhost:8081/primero");
    
    
    let info = response.data.map(resitem=>{
      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      // document.body.style.backgroundColor = "#" + randomColor;
      // color.innerHTML = "#" + randomColor;
      let item = {}
      item.title=resitem._id;
      item.value=resitem.count;
      item.color="#"+randomColor;
      return item;
    });
    console.log(info);

    this.setState({data_primer_reporte: info});
  }

  async getSegundoReporte(){
    let response = await axios.get("http://localhost:8081/segundo");
    let info = response.data.map(resitem=>{
      let randomColor = Math.floor(Math.random()*16777215).toString(16);
      let item = {}
      item.title=resitem._id;
      item.value=resitem.count;
      item.color="#"+randomColor;
      return item;
    });
    this.setState({data_segundo_reporte: info});
  }

  async getCuartoReporte(){
    let response = await axios.get("http://localhost:8081/cuarto");
    let labels = response.data.map(resitem=>{
      return resitem._id;
    });
    let personas = response.data.map(resitem=>{
      return resitem.personas;
    })
    this.setState({data_cuarto_reporte: {"labels":labels, "data":personas}},console.log(this.state.data_cuarto_reporte));
  }

  handleChange = e =>{
    e.preventDefault();
    this.setState({[e.target.name]: e.target.name==="primer_reporte"?
    !this.state.primer_reporte :   e.target.name==="segundo_reporte" ?
    !this.state.segundo_reporte :   e.target.name==="tercer_reporte" ?
    !this.state.tercer_reporte :   e.target.name==="cuarto_reporte" ?
    !this.state.cuarto_reporte :   false
  });

  if(e.target.name==="tercer_reporte" && ! this.state.tercer_reporte){
    this.getDataAxios();
  }else if(e.target.name==="primer_reporte" && ! this.state.primer_reporte){
    this.getPrimerReporte();
  }else if(e.target.name==="segundo_reporte" && ! this.state.segundo_reporte){
    this.getSegundoReporte();
  }else if(e.target.name==="cuarto_reporte" && ! this.state.cuarto_reporte){
    this.getCuartoReporte();
  }

  }


  render() {
    let {primer_reporte, segundo_reporte, tercer_reporte, cuarto_reporte, last_item} = this.state;
    return (
      <React.Fragment>
        <div className="header">
          <h1>Coronavirus</h1>
        </div>
        <div className="options">
          { 
            primer_reporte ===true? 
            <button onClick={this.handleChange} name="primer_reporte" className="bg-primary">Top 3</button>
            : <button onClick={this.handleChange} name="primer_reporte" >Top 3</button>
          }
          { 
            segundo_reporte ===true? 
            <button onClick={this.handleChange} name="segundo_reporte" className="bg-primary">Graica pie todos los departamentos</button>
            : <button onClick={this.handleChange} name="segundo_reporte" > Graica pie todos los departamentos</button>
          }
          { 
            tercer_reporte===true? 
            <button onClick={this.handleChange} name="tercer_reporte" className="bg-primary">Ultimo caso agregado a redis</button>
            : <button onClick={this.handleChange} name="tercer_reporte" > Ultimo caso agregado a redis</button>
          }
          { 
            cuarto_reporte===true? 
            <button onClick={this.handleChange} name="cuarto_reporte" className="bg-primary">Grafica de barras</button>
            : <button onClick={this.handleChange} name="cuarto_reporte" > Grafica de barras</button>
          }
        </div>
        <div className="App">   
            {
              primer_reporte===true?
                <PrimerReporte data={this.state.data_primer_reporte} title="Top 3 departamentos afectados" descripcion="Los 3 departamentos mas afectados por el coronavirus mostrado en una grafica pie. Los datos fueron consultados a mongodb"> </PrimerReporte> 
                : ''
            }
            {
              segundo_reporte===true?
                <PrimerReporte data={this.state.data_segundo_reporte} title="Todos los departamentos afectados" descripcion="Todos los departmaentos afectados por el coronavirus mostrado en una grafica pie. Los datos fueron consultados a mongodb"></PrimerReporte> 
                : ''
            }
            { tercer_reporte===true?
              <React.Fragment>
                <small>El ultimo caso registrado fue el de </small>
                <h1>{last_item.name}</h1>
                <p>El caso de <strong>{last_item.name}</strong> de {last_item.age} fue registrado en {last_item.location} se cree que el tipo
                de infeccion es {last_item.infectedtype} y actualmente su estado es {last_item.state} </p>
                <small>Esta informacion se muestra desde redis, utilizando el comando lrange casos 0 -1 y mostrando el primer resultado, ya que
                  todos los datos se guardaron usnado lpush en la lista casos.
                </small>
              </React.Fragment>
              :
              ''
            }
            {
              cuarto_reporte===true?
                <HorizontalBarExample data={this.state.data_cuarto_reporte} descripcion="Grafica de barras que muesta la cantidad de afectados por rango de 10 años."></HorizontalBarExample> 
                : ''
            }
        </div>
        <div className="footer">
          <small>Brandon Chitay - 201503385</small>
          <small>Pablo Osuna </small>
          <small>Guillermo</small>
        </div>
      </React.Fragment>
    )
  }
}

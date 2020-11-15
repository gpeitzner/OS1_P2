import React, { Component } from 'react'
import {HorizontalBar} from 'react-chartjs-2';

export default class CuartoReporte extends Component {
    
    render() {
        
        let data = {
            labels: this.props.data.labels,
            datasets: [
              {
                label: 'Cantidad de afectados en rango de 10 en 10',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: this.props.data.data
              }
            ]
        };

        return (
            <div className="Reporte">
            <div className="grafica">
                <h2>Cantidad de afectados por rango de años</h2>
                <HorizontalBar data={data} />
            </div>
            <div className="description">
                <div className="title">
                    <h2>Descripcion</h2>
                    {this.props.descripcion}
                </div>
            </div>
            <div className="data">
            </div>
        </div>
        );
    }
}
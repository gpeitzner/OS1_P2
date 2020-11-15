import React, { Component } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import './graficas.css'

export default class PrimerReporte extends Component {

    componentDidMount = () =>{
        console.log(this.props.data);
    }
    render() {
        return (
            <div className="Reporte">
                <h2>{this.props.title}</h2>
                <div className="grafica">
                    {
                        this.props.data? 
                            <PieChart
                            // data={[
                            //     { title: 'One', value: 10, color: '#E38627' },
                            //     { title: 'Two', value: 15, color: '#C13C37' },
                            //     { title: 'Three', value: 20, color: '#6A2135' },
                            // ]}
                            data={
                                this.props.data.map(item=>{
                                return item;
                                })
                            }
                        />
                        : ''    
                    }
                </div>
                <div className="details">
                    <table>
                        <tr>
                            <th><h1>Location</h1></th>
                            <th><h1>Value</h1></th>
                            <th><h1>Color</h1></th>
                        </tr>
                        {this.props.data.map(item=>{
                            return (
                                <tr>
                                    <td><h1>{item.title}</h1></td>
                                    <td><h1>{item.value}</h1></td>
                                    <td style={{backgroundColor:item.color}}><h1>{item.color}</h1></td>
                                </tr>        
                            )
                        })}
                    </table> 
                </div>
                <div className="description">
                    <div className="title">
                        <h2>Descripcion</h2>
                    </div>
                    {this.props.descripcion}
                </div>
            </div>
        )
    }
}

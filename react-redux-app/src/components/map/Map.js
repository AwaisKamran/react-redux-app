import React from 'react';
import { Component } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/turf'

const pointLayer = {
    type: 'circle',
    paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
};

const routeLayer = {
    id: 'route',
    source: 'route',
    type: 'line',
    paint: {
        'line-width': 1,
        'line-color': '#007cbf'
    }
}

var factor = 0.0005;
var originLongitude = -122.4376;
var originLatitude = 37.7577;
var counter = 0;
var steps = 300;
export default class Map extends Component {
    state = {
        pointData: null,
        routeData: null,
        viewport: {
            latitude: originLatitude,
            longitude: originLongitude,
            zoom: 16
        }
    };
    animation = null;
    TOKEN = "pk.eyJ1IjoiYXdhaXNrIiwiYSI6ImNrMWhqamVseTBjdnAzZG5yNmEwcW1yNGoifQ.xXo0nVsOswONHV85L2VWlA";

    componentDidMount() {
        this._animatePoint();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.animation);
    }

    _onViewportChange = viewport => this.setState({ viewport });

    _animatePoint = () => {
        if (this.state.routeData) {
            if(counter < steps){
                this.setState({
                    pointData: {
                        type: 'Point',
                        coordinates: this.state.routeData.features[0].geometry.coordinates[counter++]
                    }
                });
            }
        } else{
            this.setState({
                pointData: {
                    type: 'Point',
                    coordinates: [originLongitude, originLatitude]
                }
            });
        }
        this.animation = window.requestAnimationFrame(this._animatePoint);
    };

    _updatePoint = () => {
        counter = 0;
        let fromLatitude = originLatitude;
        let toLatitude = originLatitude + factor;
        this._getDistance(originLongitude, fromLatitude, toLatitude);
        originLatitude += factor;
    }

    _getDistance = (originLongitude, fromLatitude, toLatitude) => {
        let from = turf.point([originLongitude, fromLatitude]);
        let to = turf.point([originLongitude, toLatitude]);
        let options = { units: 'kilometers' };
        let distance = turf.distance(from, to, options);

        let routeData = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [originLongitude, fromLatitude],
                        [originLongitude, toLatitude]
                    ]
                }
            }]
        }
        this.setState({ routeData }, function () {
            this._getArcByDistance(distance);
        });

        console.log(`The distance from to and from: ${distance} km`);
    }

    _getArcByDistance = (distance) => {
        let arc = [];
        for (let i = 0; i < distance; i += distance / steps) {
            let segment = turf.along(this.state.routeData.features[0], i, { units: 'kilometers' });
            arc.push(segment.geometry.coordinates);
        }
        console.log(`The arc values are: ${arc}`);
        let routeData = this.state.routeData;
        routeData.features[0].geometry.coordinates = arc;
        this.setState({ routeData }, function () {
            console.log("Arc updated on the map!");
        });
    }

    render() {
        const { viewport, pointData, routeData } = this.state;
        return (
            <div>
                <MapGL
                    {...viewport}
                    width="1000px"
                    height="550px"
                    mapboxApiAccessToken={this.TOKEN}
                    onViewportChange={this._onViewportChange}
                >
                    {pointData && (
                        <Source type="geojson" data={pointData}>
                            <Layer {...pointLayer} />
                        </Source>
                    )}

                    {routeData && (
                        <Source type="geojson" data={routeData}>
                            <Layer {...routeLayer} />
                        </Source>
                    )}
                </MapGL><br/>
                <button onClick={this._updatePoint}>Click</button><br/>
                <div>
                    <span>From {originLongitude}</span> &nbsp; &nbsp; 
                    <span>To {originLatitude}</span>
                </div>
            </div>
        );
    }
}
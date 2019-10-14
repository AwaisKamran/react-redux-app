import React from 'react';
import { Component } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';

const pointLayer = {
    type: 'circle',
    paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
};

function pointOnCircle({ center, angle, radius }) {
    return {
        type: 'Point',
        coordinates: [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius]
    };
}

export default class Map extends Component {
    state = {
        pointData: null,
        viewport: {
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 17
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
        this.setState({
            pointData: pointOnCircle({ center: [-122.4376, 37.7577], angle: Date.now() / 1000, radius: 0.001 })
        });
        this.animation = window.requestAnimationFrame(this._animatePoint);
    };


    render() {
        const { viewport, pointData } = this.state;

        return (
            <MapGL
                {...viewport}
                width="1200px"
                height="750px"
                mapboxApiAccessToken={this.TOKEN}
                onViewportChange={this._onViewportChange}
            >
                {pointData && (
                    <Source type="geojson" data={pointData}>
                        <Layer {...pointLayer} />
                    </Source>
                )}
            </MapGL>
        );
    }
}
import React from 'react'
import { Map, Marker } from 'react-amap';


const deviceMonitor = () => {

    let mapOptions = {
        city: "北京",
        mapCenter:[116.418261, 39.921984],  //城市定位，经纬度定位只能选择1个
        mapZoom: 10, //地图缩放
        mapKey: '95065ba531f10772260db34e27b35866',   //你的高德key
        status: { //是否支持放大拖拽
            zoomEnable: true,
            dragEnable: true,
        },
        mapMaker :[  //marker标记点(list)
            {lnglat:[116.401728,39.911984],text:'要显示的内容1'},
            {lnglat:[116.436691,39.921984],text:'要显示的内容2'}
        ],
        plugins:['ToolBar']
    }

    return (
        <div style ={{width:"100vw",height:"95vh"}}>
             <Map 
                amapkey={mapOptions.mapKey} 
                city={mapOptions.city} 
                zoom={mapOptions.mapZoom} 
                center={mapOptions.mapCenter} 
                status={mapOptions.status} 
                plugins={mapOptions.plugins} 
                // events={this.amapEvents}
            >
                {/* {this.data.mapData.mapMaker.map((comment) => (
                    <Marker position={comment.lnglat} events={this.markerEvents}>
                    </Marker>
                ))} */}
            </Map>
        </div>
    )
}

export default deviceMonitor
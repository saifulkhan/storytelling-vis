declare module "react-jvectormap" {
  const VectorMap;

  VectorMap.propTypes = {
    containerStyle: PropTypes.object,
    containerClassName: PropTypes.string,
    map: PropTypes.oneOf(maps).isRequired,
    backgroundColor: PropTypes.string,
    zoomOnScroll: PropTypes.bool,
    zoomOnScrollSpeed: PropTypes.bool,
    panOnDrag: PropTypes.bool,
    zoomMax: PropTypes.number,
    zoomMin: PropTypes.number,
    zoomStep: PropTypes.number,
    zoomAnimate: PropTypes.bool,
    regionsSelectable: PropTypes.bool,
    regionsSelectableOne: PropTypes.bool,
    markersSelectable: PropTypes.bool,
    markersSelectableOne: PropTypes.bool,
    regionStyle: PropTypes.object,
    regionLabelStyle: PropTypes.object,
    markerStyle: PropTypes.object,
    markerLabelStyle: PropTypes.object,
    markers: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    series: PropTypes.object,
    focusOn: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    labels: PropTypes.object,
    selectedRegions: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]),
    selectedMarkers: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string,
    ]),
    onRegionTipShow: PropTypes.func,
    onRegionOver: PropTypes.func,
    onRegionOut: PropTypes.func,
    onRegionClick: PropTypes.func,
    onRegionSelected: PropTypes.func,
    onMarkerTipShow: PropTypes.func,
    onMarkerOver: PropTypes.func,
    onMarkerOut: PropTypes.func,
    onMarkerClick: PropTypes.func,
    onMarkerSelected: PropTypes.func,
    onViewportChange: PropTypes.func,
    zoomButtons: PropTypes.bool,
  };

  export { VectorMap };
}

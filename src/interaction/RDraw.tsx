import React from 'react';
import {Collection, Feature, MapBrowserEvent} from 'ol';
import {Geometry} from 'ol/geom';
import {default as Draw, DrawEvent} from 'ol/interaction/Draw';
import {StyleLike} from 'ol/style/Style';
import {Vector as SourceVector} from 'ol/source';

import {default as RPointer, type RPointerProps} from './RPointer';

/**
 * @propsfor RDraw
 */
export interface RDrawProps extends RPointerProps {
    /** Type of the geometry */
    type:
        | 'Point'
        | 'LineString'
        | 'LinearRing'
        | 'Polygon'
        | 'MultiPoint'
        | 'MultiLineString'
        | 'MultiPolygon'
        | 'GeometryCollection'
        | 'Circle';

    /**
     * The maximum distance in pixels between "down" and "up" for a "up" event
     * to be considered a "click" event and actually add a point/vertex to the
     * geometry being drawn.
     *
     * The default of 6 was chosen for the draw interaction to behave correctly
     * on mouse as well as on touch devices.
     *
     * @default 6
     */
    clickTolerance?: number;

    /**
     * Destination collection for the drawn features.
     */
    features?: Collection<Feature<Geometry>>;

    /**
     * Destination source for the drawn features.
     */
    source?: SourceVector;

    /** An optionnal condition for triggering the interaction
     * @default noModifierKeys */
    condition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /** An optional OpenLayers condition to allow the interaction to finish */
    finishCondition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /** An optional OpenLayers condition to activate freehand drawing
     * @default shiftKeyOnly */
    freehandCondition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /**
     * Style for rendering while drawing, supports only Openlayers styles.
     * Once the interaction is finished, the resulting feature will adopt
     * the style of its layer.
     */
    style?: StyleLike;

    /** Do not trigger pointer events while the interaction is active */
    stopClick?: boolean;

    /** Maximum number of points allowed per feature
     * @default Infinity */
    maxPoints?: number;

    /** Minimum number of points allowed per feature
     * @default 2-3 */
    minPoints?: number;

    /** Snap tolerance in pixels
     * @default 12 */
    snapTolerance?: number;

    /** Called on draw start */
    onDrawStart?: (this: RDraw, e: DrawEvent) => void;

    /** Called on draw end */
    onDrawEnd?: (this: RDraw, e: DrawEvent) => void;

    /** Called on draw cancel */
    onDrawAbort?: (this: RDraw, e: DrawEvent) => void;
}

/** Pointer interaction for drawing features */
export default class RDraw extends RPointer<RDrawProps> {
    protected static classProps = [
        'clickTolerance',
        'features',
        'source',
        'condition',
        'finishCondition',
        'freehandCondition',
        'style',
        'stopClick',
        'maxPoints',
        'minPoints',
        'snapTolerance'
    ];
    ol: Draw;

    createOL(props: RDrawProps): Draw {
        if (!(props.features || props.source)) {
            if (!this?.context?.vectorsource) {
                throw new Error(
                    'A Draw interaction must be part of a vector layer ' +
                        'if not provided with the features or source option'
                );
            }
        }
        this.classProps = RDraw.classProps;
        return new Draw({
            type: props.type,
            source: props.source ?? this.context.vectorsource,
            ...Object.keys(props)
                .filter((p) => this.classProps.includes(p))
                .reduce((ac, p) => ({...ac, [p]: props[p]}), {})
        });
    }
}

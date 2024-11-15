import React from 'react';
import {Collection, Feature, MapBrowserEvent} from 'ol';
import {Geometry} from 'ol/geom';
import {default as Modify, ModifyEvent} from 'ol/interaction/Modify';
import {StyleLike} from 'ol/style/Style';

import {default as RPointer} from './RPointer';

/**
 * @propsfor RModify
 */
export interface RModifyProps {
    /** An optionnal condition for triggering the interaction
     * @default primaryAction */
    condition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /** An optional OpenLayers condition to allow removal of the feature
     * @default (altKeyOnly+singleClick) */
    deleteCondition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /** An optional OpenLayers condition to allow adding of a vertex
     * @default true */
    insertVertexCondition?: (e: MapBrowserEvent<UIEvent>) => boolean;

    /**
     * Style for rendering while drawing, supports only Openlayers styles.
     * Once the interaction is finished, the resulting feature will adopt
     * the style of its layer.
     */
    style?: StyleLike;

    /** Snap tolerance in pixels
     * @default 10 */
    pixelTolerance?: number;

    /** True hit detection based on feature shape
     * @default false */
    hitDetection?: number;

    /**
     * The features the interaction works on.
     * If a feature collection is not provided, a vector source must be
     * provided with the source option.
     */
    features?: Collection<Feature<Geometry>>;

    /** Called on modify start */
    onModifyStart?: (this: RModify, e: ModifyEvent) => void;

    /** Called on modify end */
    onModifyEnd?: (this: RModify, e: ModifyEvent) => void;
}

/** Pointer interaction for modifying existing features */
export default class RModify extends RPointer<RModifyProps> {
    protected static classProps = [
        'condition',
        'deleteCondition',
        'insertVertexCondition',
        'style',
        'pixelTolerance',
        'hitDetection',
        'features'
    ];
    ol: Modify;

    createOL(props: RModifyProps): Modify {
        if (!props.features) {
            if (!this.context?.vectorsource) {
                throw new Error(
                    'A Modify interaction must be part of a vector layer \
                    if not provided with the features option'
                );
            }
        }
        this.classProps = RModify.classProps;
        return new Modify({
            source: this.context?.vectorsource,
            ...Object.keys(props)
                .filter((p) => this.classProps.includes(p))
                .reduce((ac, p) => ({...ac, [p]: props[p]}), {})
        });
    }
}

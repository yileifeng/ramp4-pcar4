import { CommonGraphicLayer, InstanceAPI } from '@/api/internal';
import { DrawState, LayerType } from '@/geo/api';
import type { RampLayerConfig } from '@/geo/api';
import { EsriAPI } from '@/geo/esri';
import { markRaw } from 'vue';

// NOTE this class is fairly meh, but gives a vanilla implementation of the common graphic layer base.
//      lets us make fancier versions later, and this remains as the vanilla without colliding with
//      the fancy versions

/**
 * A common layer class which implements a basic graphic layer (vector graphics not bound to a schema).
 */
export class GraphicLayer extends CommonGraphicLayer {
    constructor(rampConfig: RampLayerConfig, $iApi: InstanceAPI) {
        super(rampConfig, $iApi);
        this.layerType = LayerType.GRAPHIC;
    }

    protected async onInitiate(): Promise<void> {
        this.esriLayer = markRaw(await EsriAPI.GraphicsLayer(this.makeEsriLayerConfig(this.origRampConfig)));
        await super.onInitiate();
    }

    /**
     * Take a layer config from the RAMP application and derives a configuration for an ESRI layer
     *
     * @param rampLayerConfig snippet from RAMP for this layer
     * @returns configuration object for the ESRI layer representing this layer
     */
    protected makeEsriLayerConfig(rampLayerConfig: RampLayerConfig): __esri.GraphicsLayerProperties {
        // NOTE: it would be nice to put esri.LayerProperties as the return type, but since we are cheating with refreshInterval it wont work
        //       we can make our own interface if it needs to happen (or can extent the esri one)
        const esriConfig: __esri.GraphicsLayerProperties = super.makeEsriLayerConfig(rampLayerConfig);

        return esriConfig;
    }

    protected onLoadActions(): Array<Promise<void>> {
        const loadPromises: Array<Promise<void>> = super.onLoadActions();

        // if we ever have a way to "configure" initial graphics in the layer config,
        // would probably want to create them here.

        this.layerTree.name = this.name;
        this.updateDrawState(DrawState.UP_TO_DATE);
        return loadPromises;
    }

    // ----------- LAYER ACTIONS -----------
}

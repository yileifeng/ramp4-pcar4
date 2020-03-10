import { ActionContext, Action } from 'vuex';
import { make } from 'vuex-pathify';

import { LayerState } from './layer-state';
import { RootState } from '@/store';
import { RampLayerConfig } from 'ramp-geoapi';
import BaseLayer from 'ramp-geoapi/dist/layer/BaseLayer';
import LayerBlueprint from './layer-blueprint.class'

import api from '@/api';

// use for actions
type LayerContext = ActionContext<LayerState, RootState>;

const getters = {
    getLayerById: (state: LayerState) => (id: string): BaseLayer | undefined => {
        return state.layers.find((layer: BaseLayer) => layer.uid === id);
    }
};

const actions = {
    addLayers: (context: LayerContext, layerConfigs: RampLayerConfig[]) => {
        const blueprints: any = [];
        layerConfigs.forEach(layerConfig => {
            blueprints.push(LayerBlueprint.makeBlueprint(layerConfig))
        });
        blueprints.forEach((blueprint: any) => {
            blueprint.makeLayer().then((layer: BaseLayer) => {
                context.commit('ADD_LAYER', layer);
            })

        })
    }
};

const mutations = {
    ADD_LAYER: (state: LayerState, value: BaseLayer) => {
        state.layers.push(value);
    }
};

export enum LayerStore {
    /**
     * (Getter) getLayerById: (id: string) => Layer | undefined
     */
    getLayerById = 'layer/getLayerById',
    /**
     * (State) layers: Layer[]
     */
    layers = 'layer/layers',
    /**
     * (Action) addLayers: (layerConfigs: RampLayerConfig[])
     */
    addLayers = 'layer/addLayers!'
}

export function layer() {
    const state = new LayerState([]);

    return {
        namespaced: true,
        state,
        getters: { ...getters },
        actions: { ...actions, ...make.actions(state) },
        mutations: { ...mutations, ...make.mutations(state) }
    };
}

import Vue from 'vue';
import { InstanceAPI, AppVersion } from './internal';
import { GeoCommonAPI } from '@/geo/api/geo-common';
import mixin from './mixin';

export * from './internal';

declare const __VERSION__: AppVersion;

// install/register mixin plugin with Vue, so it's available on all Vue instances
Vue.use(mixin);

export interface APIInterface {
    Instance: typeof InstanceAPI;

    /**
     * Version information of R4MP.
     *
     * @type {AppVersion}
     * @memberof APIInterface
     */
    version: AppVersion;

    /**
     * Common Geo classes and utilities not tied to a RAMP instance
     */
    GEO: GeoCommonAPI;
}

let geocommon: GeoCommonAPI = new GeoCommonAPI();

const api: APIInterface = {
    Instance: InstanceAPI,

    version: __VERSION__, // this is populated by the build process; see `vue.config.js`

    get GEO(): GeoCommonAPI {
        return geocommon;
    }
};

// export `InstanceApi` as `Instance` on global RAMP interface
export default api as APIInterface;

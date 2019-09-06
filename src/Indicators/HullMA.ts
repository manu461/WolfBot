import * as utils from "@ekliptor/apputils";
const logger = utils.logger
    , nconf = utils.nconf;
import {AbstractIndicator, IntervalIndicatorParams} from "./AbstractIndicator";
import {TaLib, TaLibParams, TaLibResult} from "./TaLib";
import {Currency, Trade, Candle} from "@ekliptor/bit-models";

/**
 * Hull Moving Average indicator
 * https://tradingsim.com/blog/hull-ma/
 */
export default class HullMA extends AbstractIndicator {
    protected params: IntervalIndicatorParams;
    protected valuesClose: number[] = [];

    constructor(params: IntervalIndicatorParams) {
        super(params)
    }

    public addCandle(candle: Candle.Candle) {
        return new Promise<void>((resolve, reject) => {
            this.valuesClose = this.addData(this.valuesClose, candle.close, this.params.interval);
            if (this.valuesClose.length < this.params.interval)
                return resolve(); // not enough data yet

            let cciParams = new TaLibParams("WMA", this.valuesClose, this.params.interval);
            this.taLib.calculate(cciParams).then((result) => {
                this.computeValue(result)
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    }

    public removeLatestCandle() {
        this.valuesClose = this.removeLatestData(this.valuesClose);
    }

    public isReady() {
        return this.value !== -1 && this.valuesClose.length >= this.params.interval;
    }

    // ################################################################
    // ###################### PRIVATE FUNCTIONS #######################
}

export {HullMA}

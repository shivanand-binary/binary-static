import { SmartChart } from '@binary-com/smartcharts';
import PropTypes      from 'prop-types';
import React          from 'react';
import { WS }         from '../../Services';
import { connect }    from '../../store/connect';

const subscribe = (request_object, callback) => {
    if (request_object.subscribe !== 1) return;
    WS.subscribeTicksHistory(request_object, callback);
};

const forget = (match_values, callback) => (
    WS.forget('ticks_history', callback, match_values)
);

const SmartCharts = ({ onSymbolChange, chart_barriers, initial_symbol }) =>  {
    const is_mobile = window.innerWidth <= 767;
    const barriers  = Object.keys(chart_barriers || {}).map(key => chart_barriers[key]);

    return (
        <React.Fragment>
            <SmartChart
                requestSubscribe={subscribe}
                requestForget={forget}
                requestAPI={WS.sendRequest.bind(WS)}
                onSymbolChange={(symbol_obj) => {
                    onSymbolChange({
                        target: {
                            name : 'symbol',
                            value: symbol_obj.symbol,
                        },
                    });
                }}
                barriers={barriers}
                initialSymbol={initial_symbol}
                isMobile={is_mobile}
            />
        </React.Fragment>
    );
};

SmartCharts.propTypes = {
    initial_symbol: PropTypes.string,
    onSymbolChange: PropTypes.func,
    chart_barriers: PropTypes.object,
};

export default connect(
    ({ trade }) => ({
        onSymbolChange: trade.handleChange,
        initial_symbol: trade.symbol,
        chart_barriers: trade.chart_barriers,
    })
)(SmartCharts);
